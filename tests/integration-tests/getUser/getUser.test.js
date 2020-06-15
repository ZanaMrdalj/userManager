"use strict"
const mochaPlugin = require("serverless-mocha-plugin")
const expect = mochaPlugin.chai.expect
const { handler } = require("../../../src/lambda/getUser")
const testData = require("./testDataGetUser.json")

/**
 * Integration test for getUser
 */
describe("Tests for getUser", () => {
    before ( (done) => {
        process.env.usersTableName = "endavans-test-user-table"
        done()
    })

    it("If event is valid, expect valid response", async () => {
        const data = await handler(testData.validEvent)
        expect(data).to.deep.equal(testData.validResponse)
    })
    it("If user doesn't exist in dynamodb, error response", async () => {
        const data = await handler(testData.invalidUserRequest)
        expect(data).to.deep.equal(testData.invalidUserResponse)
    })
    it("If user enters no data, returns 400 error message", async () => {
        const data = await handler(testData.noDataRequest)
        expect(data).to.deep.equal(testData.noDataResponse)
    })
})