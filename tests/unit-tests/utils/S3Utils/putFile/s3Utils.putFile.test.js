"use strict"
const AWSMock = require("aws-sdk-mock")
const AWS = require("aws-sdk")
const mochaPlugin = require("serverless-mocha-plugin")
const expect = mochaPlugin.chai.expect
const { putFile } = require("../../../../../src/utils/s3Utils")
const testData = require("./testDataPutFile.json")

/**
 * Unit test for putFile function for S3
 */
describe("Tests if the putFile function is working correctly", () => {
    before ( (done) => {
        AWSMock.setSDKInstance(AWS)
        process.env.avatarBucketName = "avatarBucket"

        AWSMock.mock("S3", "upload", (params, callback) => {
            if (JSON.stringify(params) === JSON.stringify(testData.validParams)) {
                return callback(null, testData.validResponse)
            }
            else {
                callback("Failed to save user data.")
            }
        })
        done()
    })

    it("If params are valid, returns url of the picture in S3", async () => {
        const data = await putFile(testData.validParams)
        expect(data).to.equal(testData.validResponse.Location)
    })


    after((done) => {
        AWSMock.restore()
        done()
    })
})