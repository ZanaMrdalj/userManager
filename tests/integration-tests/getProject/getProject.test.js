"use strict"
const mochaPlugin = require("serverless-mocha-plugin")
const expect = mochaPlugin.chai.expect
const { handler } = require("../../../src/lambda/getProject")
const testData = require("./testDataGetProject.json")
/**
 * Integration test for getProject
 */
describe("Tests for getProject", () => {

    process.env.projectTableName = "endavans-test-project-table"
    it("Returns valid response for valid event data", async () => {
        const data = await handler(testData.validEvent)
        expect(data).to.deep.equal(testData.validResponse)
    })
    it("Returns error response if project doesn't exist in dynamodb", async () => {
        const data = await handler(testData.nonExistentProjectRequest)
        expect(data).to.deep.equal(testData.nonExistentProjectResponse)
    })
    it("Returns error response if project isn't requested by number", async () => {
        const data = await handler(testData.invalidRequest)
        expect(data).to.deep.equal(testData.invalidRequestResponse)
    })
})