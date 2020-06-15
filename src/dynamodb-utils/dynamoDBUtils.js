"use strict"
/**
 * wrapper for document client DynamoDB
 */
const { raw: dynamoDb, doc: docClient } = require("serverless-dynamodb-client")
/**
 * Wraps the Document.Client put function
 *
 * @param params {DocumentClient.PutItemInput} - params for putting data in DynamoDB
 * @return {function} docClient.put - returns a function that puts params into DynamoDB
 */
function put (params){
    console.log("Params for put action:", JSON.stringify(params))
    return docClient.put(params)
}
/**
 * Wraps the Document.Client get function
 *
 * @param {DocumentClient.GetItemInput} params - params for getting data from DynamoDb
 * @return {function} docClient.get - returns a function that get's an item from DynamoDB
 */
function get(params){
    console.log("Params for get action:", JSON.stringify(params))
    return docClient.get(params)
}

/**
 * Wraps the Document.Client update function
 * @param params
 * @returns {Request<DocumentClient.UpdateItemOutput, AWSError>}
 */
function update(params){
    console.log("Params for update action:", JSON.stringify(params))
    return docClient.update(params)
}

/**
 * *Wraps the Document.Client delete function
 *
 * @param params
 * @returns {Request<DocumentClient.DeleteItemOutput, AWSError>}
 */
function deleteItem(params) {
    console.log("Params for delete action:", JSON.stringify(params))
    return docClient.delete(params)
}

/**
 * Wraps the Document.Client transWrite function
 * @param params
 * @returns {Request<DocumentClient.TransactWriteItemsOutput, AWSError>}
 */
function transactWrite(params){
    console.log("Params for transact action:", JSON.stringify(params))
    return docClient.transactWrite(params)
}

/**
 * Wraps the Document.Client createSet function
 * @param params
 * @returns {DocumentClient.DynamoDbSet}
 */
function createSet(params){
    console.log("Params for createSet action:", JSON.stringify(params))
    return docClient.createSet(params)
}

module.exports = {
    put: put,
    get: get,
    update: update,
    deleteItem: deleteItem,
    transactWrite: transactWrite,
    createSet: createSet
}