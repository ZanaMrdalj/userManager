"use strict"
const mochaPlugin = require("serverless-mocha-plugin")
const expect = mochaPlugin.chai.expect
const { createParamsForS3 } = require("../../../../../src/utils/saveUserUtils")
const testData = require("./testDataCreateS3Params.json")
/**
 * Unit test for createParamsForS3
 */
describe("Tests for createParamsForS3 function", () => {
    process.env.avatarBucketName = "avatarBucket"

    it("If all params have been created, returns params", () => {
        const data = createParamsForS3(testData.validParamsForCreateParams)
        expect(JSON.stringify(data)).to.equal(testData.validResponseForCreateParams)
    })

})