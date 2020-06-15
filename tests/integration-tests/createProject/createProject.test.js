"use strict"
const mochaPlugin = require("serverless-mocha-plugin")
const expect = mochaPlugin.chai.expect
const testData = require("./testDataCreateProject.json")
const { handler } = require("../../../src/lambda/createProject")
//const AWS = require("aws-sdk")
//AWS.config.update({region:'us-east-2'})
/**
 * Integration test for createProject.js
 */
describe("Integration test for createProject.js", function () {
    this.timeout(17000)
    before ( (done) => {
        process.env.usersTableName = "endavans-test-user-table"
        process.env.projectTableName = "endavans-test-project-table"
        done()
    })

    it("If event is valid, returns valid response", async () => {
        const data = await handler(testData.validEvent)
        expect(data).to.deep.equal(testData.validEventResponse)
    })
    it("If event json is invalid, return error message", async () => {
        const data = await handler(testData.invalidJson)
        expect(data).to.deep.equal(testData.invalidJsonResponse)
    })
    it("If user position is not valid, return error message", async () => {
        const data = await handler(testData.invalidPosition)
        expect(data).to.deep.equal(testData.invalidPositionResponse)
    })
    it("If first transaction failes, return error message", async () => {
        const data = await handler(testData.eventFirstTransactionFails)
        expect(data).to.deep.equal(testData.firstTransactionFailsResponse)
    })
    it("If user position in request doesn't match user position in dynamoDb, return error message", async () => {
        const data = await handler(testData.positionNotMatching)
        expect(data).to.deep.equal(testData.positionNotMatchingResponse)
    })
    it("If project number already exists in dynamoDb, return valid message", async () => {
        const data = await handler(testData.existingProject)
        expect(data).to.deep.equal(testData.validEventResponse)
    })
    it("If user in request doesn't exist in dynamoDb, return error message", async () => {
        const data = await handler(testData.notExistingUser)
        expect(data).to.deep.equal(testData.notExistingUserResponse)
    })
    it("Returns an error response if team members is not a list of objects", async () => {
        const data = await handler(testData.invalidTypeTeamMembers)
        expect(data).to.deep.equal(testData.invalidTypeTeamMembersResponse)
    })
    it("Returns an error response if client name is not a string", async () => {
        const data = await handler(testData.invalidClientName)
        expect(data).to.deep.equal(testData.invalidClientNameResponse)
    })
    it("Returns an error response if there are no team members", async () => {
        const data = await handler(testData.noTeamMembers)
        expect(data).to.deep.equal(testData.noTeamMembersResponse)
    })
    it("Returns an error response if projectNumber is not a number", async () => {
        const data = await handler(testData.invalidProjectNumber)
        expect(data).to.deep.equal(testData.invalidProjectNumberResponse)
    })
    it("Returns an error response if project name is not a string", async () => {
        const data = await handler(testData.invalidProjectName)
        expect(data).to.deep.equal(testData.invalidProjectNameResponse)
    })

    it("Returns an error response if project name is missing", async () => {
        const data = await handler(testData.missingProjectName)
        expect(data).to.deep.equal(testData.missingProjectNameResponse)
    })
    it("Returns an error response if project number is missing", async () => {
        const data = await handler(testData.missingProjectNumber)
        expect(data).to.deep.equal(testData.missingProjectNumberResponse)
    })
    it("Returns an error response if client name is missing", async () => {
        const data = await handler(testData.missingClientName)
        expect(data).to.deep.equal(testData.missingClientNameResponse)
    })
    it("Returns an error response if team members are missing", async () => {
        const data = await handler(testData.missingTeamMembers)
        expect(data).to.deep.equal(testData.missingTeamMembersResponse)
    })
})