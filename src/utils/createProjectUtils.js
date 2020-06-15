"use strict"
const { Position } = require("../data-clases/user")
/**
 * checks if the params for createProject are valid
 * @param {Object} requestBody
 * @returns {boolean} - returns true if all params are valid
 */
const checkRequestBody = (requestBody) => {
    if (requestBody.projectNumber === undefined)
        throw Error ("Missing project number!")
    if (requestBody.projectName === undefined)
        throw Error("Missing project name!")
    if (requestBody.clientName === undefined)
        throw Error ("Missing client name!")
    if (requestBody.teamMembers === undefined)
        throw Error ("Missing list of team members!")

    if ( typeof requestBody.projectName !== "string")
        throw Error ("Project name must be a string!")
    if (typeof requestBody.projectNumber !== "number")
        throw Error ("Project number must be a number!")
    if (typeof requestBody.clientName !== "string")
        throw Error ("Client name must be a string!")
    if ( !Array.isArray(requestBody.teamMembers))
        throw Error ("Team members must be a list of objects!")

    const listLength = requestBody.teamMembers.length
    if ( listLength < 1)
        throw Error ("There must be at least one team member.")
    else {
        requestBody.teamMembers.forEach( element => {
            if (!element.hasOwnProperty("email"))
                throw Error ("Team member must have email to be identified!")
            if (!element.hasOwnProperty("position"))
                throw Error ("Team member must have position data!")
            if ( !Object.values(Position).includes(element.position) )
                throw Error ("Team member position is not valid.")
        })
    }
    return true
}

module.exports = {
    checkRequestBody: checkRequestBody
}