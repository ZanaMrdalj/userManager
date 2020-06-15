'use strict'

/**
 * Creates valid API response.
 *
 * @param {number} statusCode - Response status code.
 * @param {Object|string} [body] - Response body.
 * @return {Object} - Returns valid API response JSON object.
 * @throws {Error} - Throws error if it fails to create a response.
 */
function createResponse(statusCode, body) {
    if (!statusCode) {
        throw Error('Failed to create response. Missing status code.')
    }
    if (typeof statusCode !== 'number') {
        throw Error('Failed to create response. Status code must be a number!')
    }
    const response = {
        statusCode,
        headers: {
            'Access-Control-Allow-Origin' : '*', // Required for CORS support to work
            'Access-Control-Allow-Credentials' : true,
            'Content-Type' : 'application/json',
            'Cache-Control': 'no-store'
        }
    }
    if (body) {
        let responseBody
        if (body instanceof Object) {
            responseBody = JSON.stringify(body)
        } else {
            responseBody = body
        }
        response.body = responseBody
    }
    return response
}

module.exports = {
    createResponse
}