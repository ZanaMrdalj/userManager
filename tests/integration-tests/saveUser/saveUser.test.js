"use strict"
const AWS = require("aws-sdk")
const mochaPlugin = require("serverless-mocha-plugin")
const expect = mochaPlugin.chai.expect
const testData = require("./integrationTestData.json")
const { handler } = require("../../../src/lambda/saveUser")
const { get } = require("../../../src/dynamodb-utils/dynamoDBUtils")
const AWSMock = require("aws-sdk-mock")

/**
 *  Integration test for saveUser.js
 */
describe ("Integration test for saveUser", () => {
    before( (done) => {

        AWSMock.setSDKInstance(AWS)
        process.env.userTableName = "endavans-test-user-table"
        process.env.avatarBucketName = "avatarBucket"

        AWSMock.mock("S3", "upload", (params, callback) => {
            console.log(JSON.stringify(params))
            if ( JSON.stringify(params) === JSON.stringify(testData.validS3Params) ||
                 JSON.stringify(params) === JSON.stringify(testData.validS3Params2) ||
                 JSON.stringify(params) === JSON.stringify(testData.validS3Params3)
            ) {
                return callback(null, testData.validS3Response)
            }
            else {
                callback("Failed to save avatar image.")
            }
        })
        done()
    })

    it("Creates valid response if data is successfully put in DynamoDB, and tries to retrieve the data from DynamoDb", async () => {
        const data = await handler (testData.lambdaRequestForSaveUserNoAvatar)
        expect(data).to.deep.equal(testData.saveUserValidParamsResponse)

        const dataFromDB = await get(testData.paramsForGetMethod).promise()
        expect(dataFromDB).to.deep.equal(testData.getMethodResponse)
    })
    it("Creates valid response if data with avatar image is successfully put in DynamoDB, and tries to retrieve the data from DynamoDb", async () => {
        const data = await handler (testData.lambdaRequestForSaveUser)
        expect(data).to.deep.equal(testData.saveUserValidParamsResponse)

        const dataFromDB = await get(testData.paramsForGetWithAvatar).promise()
        expect(dataFromDB).to.deep.equal(testData.getMethodResponseWithAvatar)
    })

    it("Creates error response if invalid Position data prevents put action", async () => {
        const data = await handler(testData.lambdaRequestBadWorkingAsFieldForSaveUser)
        expect(data).to.deep.equal(testData.saveUserErrorResponseInvalidPosition)
    })

    it("Creates error response if invalid Email data prevents put action", async () => {
        const data = await handler(testData.lambdaEmailBadRequestForSaveUser)
        expect(data).to.deep.equal(testData.saveUserErrorResponseInvalidEmail)
    })

    it("Creates error response if short userName data prevents put action", async () => {
        const data = await handler(testData.lambdaRequestWithShortNameForSaveUser)
        expect(data).to.deep.equal(testData.saveUserErrorResponseShortUserName)
    })
    it("Creates error response if long userName data prevents put action", async () => {
        const data = await handler(testData.lambdaRequestWithLongNameForSaveUser)
        expect(data).to.deep.equal(testData.saveUserErrorResponseLongUserName)
    })

    it( "Creates error response if key format for workingAs is not valid", async ()=> {
        const data = await handler(testData.lambdaWorkingAsBadRequestForSaveUser)
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

    it("Creates a valid response for user who already had projectNumber", async () => {
        const data = await handler(testData.lambdaRequestExistingUser)
        expect(data).to.deep.equal(testData.existingUserResponse)

        const dataFromDB = await get(testData.paramsForGet2).promise()
        expect(dataFromDB).to.deep.equal(testData.getMethodResponse2)
    })

    after((done) => {
        AWSMock.restore()
        done()
    })
})