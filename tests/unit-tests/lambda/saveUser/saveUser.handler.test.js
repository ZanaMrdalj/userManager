"use strict"
const AWSMock = require("aws-sdk-mock")
const AWS = require("aws-sdk")
const mochaPlugin = require("serverless-mocha-plugin")
const expect = mochaPlugin.chai.expect
const testData = require("./testData.json")
const { handler } = require("../../../../src/lambda/saveUser")
AWS.config.update({region:'us-east-2'})
/**
 *  Unit test for saveUser.js
 */
describe ("Unit test for saveUser.js lambda", () => {
    before((done) => {
        AWSMock.setSDKInstance(AWS)
        process.env.userTableName = "endavans-dev-user-table"
        process.env.avatarBucketName = "avatarBucket"

        AWSMock.mock("S3", "upload", (params, callback) => {
            if (JSON.stringify(params) === JSON.stringify(testData.validS3Params)) {
                return callback(null, testData.validS3Response)
            }
            else {
                callback("Failed to save avatar.")
            }
        })

        AWSMock.mock("DynamoDB.DocumentClient", "update", (params, callback) => {
            if ((JSON.stringify(params) === JSON.stringify(testData.saveUserValidParams)) || (JSON.stringify(params) === JSON.stringify(testData.saveUserValidParamsWithoutAvatarLink))) {
                return callback(null, testData.saveUserValidParamsResponse)
            }
            callback("Failed to save user data.")
        })
        done()
    })

    it("Creates valid response if data including avatar image is successfully put in DynamoDB", async () => {
        const data = await handler (testData.lambdaRequestForSaveUser)
        expect(data).to.deep.equal(testData.saveUserValidParamsResponse)
    })
    it("Creates valid response if data without avatar image is successfully put in DynamoDB", async () => {
        const data = await handler (testData.lambdaRequestForSaveUserNoImage)
        expect(data).to.deep.equal(testData.saveUserValidParamsResponse)
    })

    it("Creates error response if invalid Position data prevents put action", async () => {
        const data = await handler(testData.lambdaWorkingAsBadRequestForSaveUser)
        expect(data).to.deep.equal(testData.saveUserErrorResponseInvalidPosition)
    })

    it("Creates error response if invalid Email data prevents put action", async () => {
        const data = await handler(testData.lambdaEmailBadRequestForSaveUser)
        expect(data).to.deep.equal(testData.saveUserErrorResponseInvalidEmail)
    })
    it("Creates error response if invalid base64image data prevents put action", async () => {
        const data = await handler(testData.lambdaBase64BadRequestForSaveUser)
        expect(data).to.deep.equal(testData.saveUserErrorResponseInvalidBase64)
    })

    it("Creates error response if short userName data prevents put action", async () => {
        const data = await handler(testData.lambdaUserNameBadRequestForSaveUser)
        expect(data).to.deep.equal(testData.saveUserErrorResponseShortUserName)
    })
    it("Creates error response if long userName data prevents put action", async () => {
        const data = await handler(testData.lambdaUserNameBadRequestLongForSaveUser)
        expect(data).to.deep.equal(testData.saveUserErrorResponseLongUserName)
    })

    it( "Creates error response if key format for workingAs is not valid", async ()=> {
        const data = await handler(testData.lambdaRequestInvalidJson)
        expect(data).to.deep.equal(testData.saveUserErrorResponseForBadJsonWorkingAs)
    })

    it("Creates error if JSON format is invalid", async () => {
        const data = await handler(testData.lambdaRequestBadJson)
        expect(data).to.deep.equal(testData.saveUserErrorResponseInvalidJson)
    })

    it("Creates error if JSON format is invalid", async () => {
        const data = await handler(testData.lambdaRequestMissingJsonBraces)
        expect(data).to.deep.equal(testData.saveUserErrorResponseInvalidJsonBraces)
    })

    after(done => {
        AWSMock.restore()
        done()
    })
})