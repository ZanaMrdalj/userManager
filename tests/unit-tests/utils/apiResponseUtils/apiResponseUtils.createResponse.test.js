"use strict"

const mochaPlugin = require("serverless-mocha-plugin")
const expect = mochaPlugin.chai.expect
const testData = require("./testData.json")
const { createResponse } = require("../../../../src/utils/apiResponseUtils")

/**
 *  Unit tests for createResponse function in apiCreateResponseUtilities
 */
describe("Unit tests for createResponse function in apiResponseUtils.js.", () => {

    it("Create valid error response with error message", () => {
        const response = createResponse(400, testData.error)
        expect(response).to.deep.equal(testData.errorResponseWithErrorMessage)
    })
    it("Create valid error response with no error message", () => {
        const response = createResponse(400)
        expect(response).to.deep.equal(testData.errorResponseWitNoErrorMessage)
    })
    it("Create error response with status code that is not a number", () => {
        try {
            createResponse("200")
            expect.fail("Error response created successfully.")
        } catch (error) {
            expect(error.message).to.deep.equal(testData.errorInvalidStatusCode)
        }
    })
    it("Create error response without status code", () => {
        try {
            createResponse()
            expect.fail("Error response created successfully.")
        } catch (error) {
            expect(error.message).to.deep.equal(testData.errorMissingStatusCode)
        }
    })
    it ("Create response when body is an object", () => {
        const response = createResponse(200, testData.jsonBody)
        expect(response).to.deep.equal(testData.jsonBodyResponse)
    })
})
