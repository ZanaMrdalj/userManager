"use strict"
const AWS = require("aws-sdk")
AWS.config.update({region:'us-east-1'})
const SES = new AWS.SES()
const { logError } = require("../utils/errorUtils")

/**
 * Sends email to a user notifying them about the project they've been assigned to.
 *
 * @param {object} event - dynamodb stream
 */
module.exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event))

    const eventData = event.Records[0]
    console.log("NewImage data", eventData.dynamodb.NewImage)

    const emails = []
    const members = eventData.dynamodb.NewImage.teamMembers.L

    for (let i=0; i<members.length; i++) {
        console.log(members[i].M.email.S)
        emails.push(members[i].M.email.S)
    }

    const params = {
        Destination: {
            ToAddresses: emails
        },
        Message: {
            Body:{
                Html: {
                    Data: "Project <span style='color:red;font-weight:bold'>" + eventData.dynamodb.NewImage.projectName.S +
                        "</span> has been updated! You're on the team.<br>Client name: <span>" + eventData.dynamodb.NewImage.clientName.S +
                        "</span style='font-weight:bold'><br>Project number:" + eventData.dynamodb.NewImage.projectNumber.N }
            },
            Subject: {
                Data: "Project updated!"
            }
        },
        Source: process.env.senderEmail,
    }

    try {
        await SES.sendEmail(params).promise()
        console.log("Successfully sent emails!")
    } catch (error) {
        logError(error)
        console.error( "Server error!")
    }
}