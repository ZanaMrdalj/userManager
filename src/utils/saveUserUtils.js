"use strict"
const { Position } = require ("../data-clases/user")

/**
 * Creates params needed for upload to S3
 *
 * @param {object} requestBody - request body
 * @returns {{ContentType: string, Bucket: string, ContentEncoding: string, Body, Key: string} || undefined}
 */
const createParamsForS3 = function (requestBody){

    const base64 = requestBody.base64image
    const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64")
    const type = base64.split(";")[0].split("/")[1]

    const paramsForS3 = {
        Bucket: process.env.avatarBucketName,
        Key: requestBody.userName + ".png",
        Body: base64Data,
        ContentEncoding: "base64",
        ContentType: `image/${type}`
    }
    return paramsForS3
}

/**
 *  Checks if parameters are valid before inserting in DynamoDB
 *
 *  @param {Object} requestBody - user details
 *  @return {Boolean} - returns true if params are valid
 *  @throws {Error} - throws an error if params are not valid
 */
const checkParams = (requestBody) => {
    if (requestBody.userName === undefined )
        throw Error ("Missing valid userName field in body.")
    if (requestBody.workingAs === undefined )
        throw Error ("Missing valid workingAs field in body.")
    if (requestBody.email === undefined)
        throw Error ("Missing valid email field in body.")

    if (typeof requestBody.userName !== "string")
        throw Error ("UserName must be a string.")
    if (requestBody.userName.length < 4)
        throw Error ("UserName must have at least 4 characters.")
    if (requestBody.userName.length > 25)
        throw Error ("UserName must have less than 25 characters.")

    const regExpEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    if ( !regExpEmail.test(requestBody.email) )
        throw Error ("Email must be a valid email address.")

    if (typeof requestBody.workingAs !== "string")
        throw Error ("Working position must be a string.")

    if ( !Object.values(Position).includes(requestBody.workingAs) )
        throw Error ("Working position not valid.")

    if (requestBody.base64image !== undefined) {
        if (typeof requestBody.base64image !== "string")
            throw Error("Base64image must be a string.")

        if ((requestBody.base64image.slice(0, 22) !== "data:image/jpeg;base64" && requestBody.base64image.slice(0, 21) !== "data:image/png;base64"))
            throw Error("Invalid base64 code.")
    }
    return true
}

module.exports = {
    createParamsForS3: createParamsForS3,
    checkParams: checkParams
}