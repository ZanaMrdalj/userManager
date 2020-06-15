"use strict"
const AWS = require("aws-sdk")

/**
 * Uploads avatar picture in S3
 *
 * @param {Object} params - params for putting in s3
 * @returns {Promise<string>} location - returns url of the avatar picture
 */
async function putFile(params) {
    console.log("params for s3 bucket avatar:\n", JSON.stringify(params))

    const s3 = new AWS.S3()
    const { Location } = await s3.upload(params).promise()

    console.log("Url:", Location)
    return Location
}

module.exports = {
     putFile: putFile
}