"use strict"
const { createResponse } = require("../utils/apiResponseUtils")
const { logError } = require("../utils/errorUtils")
/**
 * Gets project data from dynamodb
 *
 * @param {Object} event - request data
 * @returns {Object} createResponse - returns valid API response object
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
       const { get } = require("../dynamodb-utils/dynamoDBUtils")
       const dataFromDB = await get(params).promise()
       if (!dataFromDB || !dataFromDB.Item)
           return createResponse(404, "Project not found.")

       return createResponse(200, dataFromDB.Item)
   } catch (error) {
       logError(error)
       return createResponse(500, "Server error. Unable to get project data.")
   }
}