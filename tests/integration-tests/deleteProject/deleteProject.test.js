"use strict"
const mochaPlugin = require("serverless-mocha-plugin")
const expect = mochaPlugin.chai.expect
const { handler } = require("../../../src/lambda/deleteProject")
const testData  = require("./testDataDeleteProject.json")

/**
 * Integration test for deleteProject
 */
describe("Integration tests for deleteProject.js", () => {

    process.env.projectTableName = "endavans-test-project-table"
    process.env.usersTableName = "endavans-test-user-table"
    it("If request is valid, return valid response", async () => {
        const data = await handler(testData.validRequest)
        expect(data).to.deep.equal(testData.validResponse)
    })
    it("If request is invalid, return error response", async () => {
        const data = await handler(testData.invalidRequest)
        expect(data).to.deep.equal(testData.invalidRequestResponse)
    })
    it("If requested project doesn't exist, return error response", async () => {
        const data = await handler(testData.nonExistentProjectRequest)
        expect(data).to.deep.equal(testData.nonExistentProjectResponse)
    })

})