"use strict"

/**
 * Logs errors.
 *
 * @param {*} error
 */
function logError(error) {
    if (error instanceof Error) {
        console.error(error.stack)
    } else {
        console.error(error)
    }
}

module.exports = {
    logError
}