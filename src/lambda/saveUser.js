"use strict"
const { createResponse } = require("../utils/apiResponseUtils")
const { checkParams, createParamsForS3 } = require("../utils/saveUserUtils")
const { logError } = require("../utils/errorUtils")
const { putFile } = require("../utils/s3Utils")

/**
 *  Saves data about user in DynamoDB
 *
 *  @param {object} event - request data
 *  @return {function} createResponse - Returns function which returns valid API response JSON object
 */
module.exports.handler = async event => {
    console.log("Received event:", JSON.stringify(event))

    let body
    try {
        body = JSON.parse(event.body)
    } catch (error) {
        logError(error)
        return createResponse(400, "Invalid body!")
    }
    console.log("Request body:\n", JSON.stringify(body))

    try {
        checkParams(body)
    } catch (error) {
        logError(error)
        return createResponse(400, error.message)
    }

    const params = {
        TableName : process.env.userTableName,
        Key: {email: body.email},
        UpdateExpression: "set userName = :userName, workingAs = :workingAs",
        ExpressionAttributeValues: {
            ":userName": body.userName,
            ":workingAs": body.workingAs
        }
    }

    try {
        if (body.base64image !== undefined) {
            const paramsForS3 = createParamsForS3(body)
            params.UpdateExpression += ", avatarLink = :avatarLink"
            params.ExpressionAttributeValues[":avatarLink"] = await putFile(paramsForS3)
        }

        const { update } = require("../dynamodb-utils/dynamoDBUtils")
        await update(params).promise()
        console.log("User data successfully put in DynamoDB:\n")
    } catch (error) {
        logError(error)
        return createResponse(500, "Server error, unable to save user.")
    }
    return createResponse(200, "Successfully saved user.")
}
