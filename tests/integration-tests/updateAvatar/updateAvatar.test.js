"use strict"
const mochaPlugin = require("serverless-mocha-plugin")
const expect = mochaPlugin.chai.expect
const { handler } = require("../../../src/lambda/updateAvatar")
const testData = require("./testDataUpdateAvatar.handler.json")
const { get } = require("../../../src/dynamodb-utils/dynamoDBUtils")

describe("test for updateAvatar",  () => {

    process.env.userTableName = "endavans-test-user-table"
    process.env.bucketUrl = "https://endavans-dev-update-user.s3-us-east-2.amazonaws.com/"

    it("Returns true if item has been updated", async () => {
        const data = await handler(testData.validEvent)
        expect(data).true

        const dataFromDB = await get(testData.paramsForGetMethod).promise()
        expect(dataFromDB).to.deep.equal(testData.getMethodResponse)
    })
     it("Returns false if item couldn't be updated.", async () => {
         const data = await handler(testData.nonExistingUserEvent)
         expect(data).false
     })

})