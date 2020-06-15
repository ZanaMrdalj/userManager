"use strict"
const { createResponse } = require("../utils/apiResponseUtils")
const { logError } = require("../utils/errorUtils")
const { deleteItem, get, update, createSet } = require("../dynamodb-utils/dynamoDBUtils")
/**
 * deletes project from dynamoDb
 *
 * @param {object} event - request event
 * @returns {object} createResponse - returns valid API response JSON object
 */
module.exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event))

    const requestData = event.pathParameters
    console.log("Path parameters:", JSON.stringify(requestData))

    if (requestData === null) {
        console.error("No path parameters given.")
        return createResponse(400, "Please enter project number.")
    }

    const requestProjectNumber = parseInt(requestData.projectNumber)
    if (Number.isNaN(requestProjectNumber)) {
        console.error("Project wasn't requested with a number.")
        return createResponse(400, "Project must be requested by project number!")
    }
    const params = {
        TableName : process.env.projectTableName,
        "Key" : {
            "projectNumber": requestProjectNumber
        }
    }

    try {
        const projectData = await get(params).promise()
        if ( !projectData || !projectData.Item)
            return createResponse(404, "Project not found!")

        const teamMembers = projectData.Item.teamMembers
        const projectNumber = createSet(requestProjectNumber)
        const promises = []

        for (const user of teamMembers) {
            const paramsForUpdate = {
                TableName : process.env.usersTableName,
                Key: { email: user.email },
                UpdateExpression: "DELETE projectNumber :projectNumber",
                ExpressionAttributeValues: {
                    ":projectNumber": projectNumber
                }
            }
            promises.push(update(paramsForUpdate).promise())
        }

        await Promise.all(promises)
        await deleteItem(params).promise()
    } catch (error) {
        logError(error)
        return createResponse(500, "Server error!")

    }
    return createResponse(200, "Project data successfully removed from DB!")
}
