"use strict"
const { checkRequestBody } = require("../utils/createProjectUtils")
const { createResponse } = require("../utils/apiResponseUtils")
const { logError } = require("../utils/errorUtils")
const { createSet, get, put, update, transactWrite } = require("../dynamodb-utils/dynamoDBUtils")
/**
 * Creates or updates project data in dynamodb
 *
 * @param {Object} event - event data
 * @returns {Object} createResponse - Returns API response JSON object
 */
module.exports.handler = async (event) =>{
    console.log("Received event:", JSON.stringify(event))

    let body
    try {
        body = JSON.parse(event.body)
        console.log("Parsed body:", body)
    } catch (error) {
        logError(error)
        return createResponse(400, "Invalid body!")
    }

    try {
        checkRequestBody(body)
    } catch (error) {
        logError(error)
        return createResponse(400, error.message)
    }

   let listForRevertingData = []
   let users
   try {
       users = await getUsers(body.teamMembers)
       for (const user of users){
           if (!user || !user.Item ){
               return createResponse(404, "Team member not found!")
           }
           listForRevertingData.push(user.Item)
       }
   } catch (error) {
       logError(error)
       return createResponse(500, "Server error!")
   }

   let oldProjectData
   try {
       const paramsForProject = getProject(body.projectNumber)
       oldProjectData = await get(paramsForProject).promise()
   } catch (error) {
       logError(error)
       return createResponse(500, "Server error!")
   }

   try {
       await transaction(body, listForRevertingData, oldProjectData)
   } catch (error){
       logError(error)
       if (error.message === "User position doesn't match user position in dynamoDb!")
           return createResponse(400, error.message)
       return createResponse(500, error.message)
   }

   if (oldProjectData.Item)
       await updateUsers(oldProjectData.Item.teamMembers, body)

   console.log("Project data successfully saved in db!")
   return createResponse(200, "Successfully created project data!")
}

/**
 * Creates params and list of dynamodb get promises for those params
 * @param {Object[]} teamMembers
 * @returns {Array}
 */
async function getUsers (teamMembers) {
    const promises = []
    for (const teamMember of teamMembers) {
        const paramsForGet = {
            TableName: process.env.usersTableName,
            Key: { email: teamMember.email }
        }
    promises.push(get(paramsForGet).promise())
    }
    const users = await Promise.all(promises)

    return users
}

/**
 * Creates params for dynamodb get
 * @param {Number} projectNumber
 * @returns {Object}
 */
function getProject (projectNumber) {
    const paramsForProject = {
        TableName: process.env.projectTableName,
        Key: {
            projectNumber: projectNumber
        }
    }
    return paramsForProject
}

/**
 * Creates params and calls transWrite for those params
 *
 * @param {Object} body
 * @param {Array} listForRevertingData
 * @param {Object} oldProjectData
 * @throws error - throws error if transaction fails.
 * @returns {Boolean}
 */
async function transaction(body, listForRevertingData, oldProjectData) {
    let allTransactParams =  [{
        Put: {
            TableName: process.env.projectTableName,
            Item: {
                projectNumber: body.projectNumber,
                projectName: body.projectName,
                clientName: body.clientName,
                teamMembers: body.teamMembers
            }
    }}]

    let transactionParams
    let usedParams = 0
    const projectNumber = createSet(body.projectNumber)

    for (let i = 0; i < body.teamMembers.length; i++) {
        allTransactParams.push({
            Update: {
                TableName: process.env.usersTableName,
                    Key: {email: body.teamMembers[i].email},
                    UpdateExpression: "add projectNumber :projectNumber",
                    ConditionExpression: "workingAs = :position",
                    ExpressionAttributeValues: {
                         ":projectNumber": projectNumber,
                         ":position": body.teamMembers[i].position
                }
            }
        })

        if ((i > 0 && i % 25 === 0) || i === body.teamMembers.length - 1){
            transactionParams = {
                TransactItems: allTransactParams.slice(usedParams, usedParams + 25)
            }
            try {
                await transactWrite(transactionParams).promise()
            } catch (error) {
                logError(error)
                await revertData(listForRevertingData, usedParams, body.projectNumber, oldProjectData)
                if (error.message.indexOf("ConditionalCheckFailed") !== -1)
                    throw Error ("User position doesn't match user position in dynamoDb!")
                throw Error ("Server error!")
            }
            usedParams +=25
        }
    }
    return true
}

/**
 * Returns previous data to projectTable and UsersTable if transaction failed
 *
 * @param {Array} listForRevert - list of user data that should be put to dynamodb
 * @param {Number} usedParams - How many params have been used successfully in transactWrite
 * @param {Number} projectNumber
 * @param {Object} oldProjectData - data that project should be reverted to
 * @returns {Boolean}
 */
async function revertData(listForRevert, usedParams, projectNumber, oldProjectData) {
    console.log("calling revert data function")

    if ( usedParams < 25 )     /* first transaction failed, no need for revert */
        return true

    const promises = []
    for (let i=0; i < usedParams; i++){
        const paramsForRevert = {
            TableName: process.env.usersTableName,
            Item: listForRevert[i]
        }
        promises.push(put(paramsForRevert).promise())
    }
    try {
        await Promise.all(promises)
    }
    catch (error) {
        logError(error)
        console.error("Couldn't revert user data!")
    }

    if ( oldProjectData ) {
        const paramsForProjectRevert = {
            TableName: process.env.projectTableName,
            Item: oldProjectData.Item
        }
        try {
            await put(paramsForProjectRevert).promise()
            console.log("Successfully reverted project data!")
        } catch (error) {
            console.error("Couldn't revert project data!")
        }
    }
    return true
}

/**
 * updates userTable if user is no longer on the project
 *
 * @param {Array} oldUsersList - List of members on the project before update
 * @param {Object} requestBody
 * @returns {Boolean}
 */
async function updateUsers (oldUsersList, requestBody){
    console.log("calling updateUsers function")

    const promises = []
    const projectNumber = createSet(requestBody.projectNumber)
    for (const oldUser of oldUsersList){

        const userExists = requestBody.teamMembers.find( newUser => oldUser.email === newUser.email)
        if ( !userExists ) {
            const paramsForUpdate = {
                TableName: process.env.usersTableName,
                Key: { email: oldUser.email },
                UpdateExpression: "DELETE projectNumber :projectNumber",
                ConditionExpression: "attribute_exists(email)",
                ExpressionAttributeValues: {
                    ":projectNumber": projectNumber
                }
            }
            promises.push(update(paramsForUpdate).promise())
        }
    }

    try {
        await Promise.all(promises)
    } catch (error) {
        logError(error)
        console.error("Couldn't remove projectNumber from user!")
    }
    return true
}