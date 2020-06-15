"use strict"
const { logError} = require("../utils/errorUtils")
const { createResponse } = require("../utils/apiResponseUtils")

/**
 * Get's an item from DynamoDB
 *
 * @param {Object} event - Event data
 * @returns {Object} createResponse - Returns API response JSON object
 */
module.exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event))
    const requestData = event.pathParameters

    if (requestData === null)
        return createResponse(400, "Please enter user email.")

    const params = {
        TableName : process.env.usersTableName,
        "Key" : requestData
    }

    let dynamoResponse
    try {
        const { get } = require("../dynamodb-utils/dynamoDBUtils")
        dynamoResponse = await get(params).promise()
        console.log("Response from dynamodb:", JSON.stringify(dynamoResponse))

        if (!dynamoResponse || !dynamoResponse.Item )
            return createResponse(404, "User not found.")
    } catch (error) {
        logError(error)
        return createResponse(500, "Unable to get user data.")
    }
    return createResponse(200, dynamoResponse.Item)
}

