"use strict"
const mochaPlugin = require("serverless-mocha-plugin")
const expect = mochaPlugin.chai.expect
const { checkRequestBody } = require("../../../../src/utils/createProjectUtils")
const testData = require("./testDataCheckParamsForCreateProject.json")
/**
 * Unit test for checkParams function for createProject api
 */
describe("Tests for checkParams", () => {
    process.env.projectTableName = "endavans-dev-project-table"

    it("Returns true if all params are valid", () => {
        const data = checkRequestBody(testData.validParams)
        expect(data).true
    })

    it("Returns error message if projectNumber is missing", () => {
        try {
            checkRequestBody(testData.missingProjectNumber)
            expect.fail("Test didn't fail - data must be valid.")
        } catch (error) {
            expect(error.message).to.equal(testData.missingProjectNumberResponse)
        }
    })
    it ("Returns error message if projectName is missing", () => {
        try {
            checkRequestBody(testData.missingProjectName)
            expect.fail("Test didn't fail - data must be valid.")
        } catch (error) {
            expect(error.message).to.equal(testData.missingProjectNameResponse)
        }
    })
    it ("Returns error message if client name is missing", () => {
        try {
            checkRequestBody(testData.missingClientName)
            expect.fail("Test didn't fail - data must be valid.")
        } catch (error) {
            expect(error.message).to.equal(testData.missingClientNameResponse)
        }
    })
    it("Returns error message if teamMembers are missing", () => {
        try {
            checkRequestBody(testData.missingTeamMembers)
            expect.fail("Test didn't fail - data must be valid.")
        } catch (error) {
            expect(error.message).to.equal(testData.missingTeamMembersResponse)
        }
    })
    it ("Returns error message if projectName is not a string", () => {
        try {
            checkRequestBody(testData.invalidProjectName)
            expect.fail("Test didn't fail - data must be valid.")
        } catch (error) {
            expect(error.message).to.equal(testData.invalidProjectNameResponse)
        }
    })
    it ("returns error message if clientName is not a string", () => {
        try {
            checkRequestBody(testData.invalidClientName)
            expect.fail("Test didn't fail - data must be valid.")
        } catch (error) {
            expect(error.message).to.equal(testData.invalidClientNameResponse)
        }
    })
    it ("returns error if projectNumber is not a number", () => {
        try {
            checkRequestBody(testData.invalidProjectNumber)
            expect.fail("Test didn't fail - data must be valid.")
        } catch (error) {
            expect(error.message).to.equal(testData.invalidProjectNumberResponse)
        }
    })
    it("Returns error if teamMembers is not a list of objects", () => {
        try {
            checkRequestBody(testData.invalidTeamMembers)
            expect.fail("Test didn't fail - data must be valid.")
        } catch (error) {
            expect(error.message).to.equal(testData.invalidTeamMembersResponse)
        }
    })
    it("Returns error if list is empty", () => {
        try {
            checkRequestBody(testData.emptyTeamMembers)
            expect.fail("Test didn't fail - data must be valid.")
        } catch (error) {
            expect(error.message).to.equal(testData.emptyTeamMembersResponse)
        }
    })
    it("Returns error if teamMembers data doesn't contain email", () => {
        try {
            checkRequestBody(testData.noEmailInTeamMembers)
            expect.fail("Test didn't fail - data must be valid.")
        } catch (error) {
            expect(error.message).to.equal(testData.noEmailInTeamMembersResponse)
        }
    })
    it("Returns error if teamMembers data doesn't contain position", () => {
        try {
            checkRequestBody(testData.noPositionInTeamMembers)
            expect.fail("Test didn't fail - data must be valid.")
        } catch (error) {
            expect(error.message).to.equal(testData.noPositionInTeamMembersResponse)
        }
    })
    it("Returns error if teamMember position is not valid", () => {
        try {
            checkRequestBody(testData.invalidPositionInTeamMembers)
            expect.fail("Test didn't fail - data must be valid.")
        } catch (error) {
            expect(error.message).to.equal(testData.invalidPositionInTeamMembersResponse)
        }
    })
})