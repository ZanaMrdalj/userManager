"use strict"
const { logError } = require("../utils/errorUtils")

/**
 * Lambda triggered by S3 upload event. Updates an item in dynamoDB.
 *
 * @param {Object} event - s3 event data
 * @returns {Boolean} - returns true if item in DynamoDb has been successfully updated
 */
module.exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event))

    const { key } = event.Records[0].s3.object
    console.log("Key of created object:", key)

    const position = key.lastIndexOf('/')
    const folderName = key.slice(0, position).replace("%40", "@")
    console.log("folder name:", folderName)

    const avatarLinkUpdate = process.env.bucketUrl + key
    console.log("Link of new avatar:", avatarLinkUpdate)

    const paramsForUpdate = {
        TableName: process.env.userTableName,
        Key: {
            email : folderName
        },
        UpdateExpression : "set avatarLink = :avatarLink",
        ConditionExpression : "attribute_exists(email)",
        ExpressionAttributeValues: {
            ":avatarLink" : avatarLinkUpdate
        }
    }

    try {
        const { update } = require("../dynamodb-utils/dynamoDBUtils")
        await update(paramsForUpdate).promise()
    } catch (error) {
        logError(error)
        console.error("Couldn't update avatarLink!")
        return false
    }
    return  true
}