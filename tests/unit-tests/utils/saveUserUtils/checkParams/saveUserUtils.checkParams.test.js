"use strict"

const mochaPlugin = require("serverless-mocha-plugin")
const expect = mochaPlugin.chai.expect
const assert = mochaPlugin.chai.assert
const { checkParams } = require ("../../../../../src/utils/saveUserUtils")
const testData = require ("./testDataCheckParams.json")
/**
 * Unit test for checkParams.
 */
describe("Validating parameters for creating users", () => {
    it("Returns valid response when all params are valid.", () => {
        const data = checkParams(testData.validParams)
        assert.equal(data, true)
    })

    describe("Tests for userName property of params", () => {
        it("Creates error when userName is not a string ", () => {
            try {
                checkParams(testData.invalidParamsWithUserNameAsNumber)
                expect.fail("Test failed - params are valid.")
            } catch (error) {
                expect(error.message).to.equal(testData.invalidParamsWithUserNameAsNumberResponse)
            }
        })
        it("Creates error when username has less then 4 chars", () => {
            try {
                checkParams(testData.userNameInvalidLength)
                expect.fail("Test failed - params are valid.")
            } catch (error) {
                expect(error.message).to.equal(testData.UserNameInvalidLengthResponse)
            }
        })
        it("Creates error when username has more then 25 chars", () => {
            try {
                checkParams(testData.userNameInvalidLength2)
                expect.fail("Test failed - params are valid.")
            } catch (error) {
                expect(error.message).to.equal(testData.UserNameInvalidLengthResponse2)
            }
        })
        it("Creates error when username is missing", () => {
            try {
                checkParams(testData.missingUserName)
                expect.fail("Test failed - username is not undefined")
            } catch (error) {
                expect(error.message).to.equal(testData.missingUserNameResponse)
            }
        })
    })

    describe("Tests for email property of params", () => {
        it("Creates error when email is not valid", () => {
            try {
                checkParams(testData.invalidEmail)
                expect.fail("Test failed - params are valid.")
            } catch (error) {
                expect(error.message).to.equal(testData.invalidEmailResponse)
            }
        })
        it("Creates error when email is missing", () => {
            try {
                checkParams(testData.missingEmail)
                expect.fail("Test failed - username is not undefined")
            } catch (error) {
                expect(error.message).to.equal(testData.missingEmailResponse)
            }
        })
    })

    describe("Tests for workingAs property of params", () => {
        it ("Creates an error if workingAs value is not one of the predefined values", () => {
            try {
                checkParams(testData.invalidParamsWorkingAs)
                expect.fail("Test failed - params are valid.")
            } catch (error){
                expect(error.message).to.equal(testData.invalidParamsWorkingAsResponse)
            }
        })
        it("Creates error when workingAs is missing", () => {
            try{
                checkParams(testData.missingWorkingAs)
                expect.fail("Test failed - workingAs is not undefined")
            } catch (error) {
                expect(error.message).to.equal(testData.missingWorkingAsResponse)
            }
        })
    })
    describe("Tests for base64image field in body", () => {
        it("Creates error when base64image code is invalid", () => {
            try {
                checkParams(testData.invalidBase64image)
                expect.fail("Test failed - base64image code is valid.")
            } catch (error) {
                expect(error.message).to.equal(testData.invalidBase64imageResponse)
            }
        })
        it("Creates error when base64image is not a string", () => {
            try {
                checkParams(testData.invalidBase64imageType)
                expect.fail("Test failed - base64image code is valid.")
            } catch (error) {
                expect(error.message).to.equal(testData.invalidBase64imageTypeResponse)
            }
        })
    })
})


