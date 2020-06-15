"use strict"

/**
 * Data class for user events.
 */
class User {

    /**
     * Constructor for User class.
     *
     * @param {string} userName - User Name.
     * @param {string} email - Email
     * @param {Position} workingAs - Working position.
     */
    constructor(userName, email, workingAs) {
        this.userName = userName
        this.email = email
        this.workingAs = workingAs
        Object.freeze(this)
    }
}

/**
 * Enum object for working positions.
 *
 * @type {Readonly<{SENIOR_DEVELOPER: string, JUNIOR_DEVELOPER: string, INTERN: string, HEAD_OF_DEVELOPMENT: string, HUMAN_RESOURCES: string}>}
 * @enum {string}
 */

const Position = Object.freeze({
    SENIOR_DEVELOPER: "Senior Developer",
    INTERMEDIATE_DEVELOPER: "Intermediate Developer",
    JUNIOR_DEVELOPER: "Junior Developer",
    INTERN: "Intern",
    HEAD_OF_DEVELOPMENT: "Head Of Development",
    HUMAN_RESOURCES: "Human Resources",
    PROJECT_MANAGER: "Project Manager",
    PROJECT_DELIVERY_MANAGER: "Project Delivery Manager",
    SCRUM_MASTER: "Scrum Master",
    PROJECT_LEADER: "Project Leader",
    UX_DESIGN: "UX Design",
    JUNIOR_QA: "Junior QA",
    INTERMEDIATE_QA: "Intermediate QA",
    SENIOR_QA: "Senior QA"
})

module.exports = {
    User: User,
    Position: Position
}