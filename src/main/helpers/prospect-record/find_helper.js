let PROSPECT_IDENTIFIER_QUERY = require('../../variables/queries.js').TBL_PROSPECT_IDENTIFIER_QUERY;
const TABLES = require('../../variables/tables.js').TABLES;
const db = require('../../utils/azureSql.js');
const dbService = require('./prospect_identifier_helper.js');
let X_Auth_Find = require('../../variables/x-auth-id-find.json');

async function findProspect(req) {
    const reqBody = req.body;

    //TO-DO needs to be integrated with Domus Cookie /validate api to get the session id, and read the value from "sub". For now mocked sub.
    //var X_Auth_ID = req.headers['x-authrization-id']; 
    // invoke /validate(X_Auth_ID.json as body)
    //var cookie = X_Auth_Find[0].sub;
    var usertype = X_Auth_Find[0].userType
    var headerProspectId;
    if (usertype === 'UNAUTH_CUSTOMER') {
        headerProspectId = await dbService.getProspectWithSessionId(X_Auth_Find[0].sub)
    } else if (usertype === 'IB_CUSTOMER') {
        headerProspectId = await dbService.getProspectWithIBID(X_Auth_Find[0].sub)
    }
    //var headerProspectId = await dbService.getProspectWithSessionId(cookie);
    //if prospect id is null for x-aurhrazition-id header return error message
    if (headerProspectId == null) {
        return { "error": `Prospect could not found with SESSIONID ${X_Auth_Find[0].sub} in the system` };
    }
    const prospect_identifier_query = PROSPECT_IDENTIFIER_QUERY.PROSPECT_IDENTIFIER_VALUES_BY_IDENTIFIER_TYPE_AND_VALUE
        .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
        .replace('<IdentifierValue>', reqBody.IdentifierValue)
        .replace('<IdentifierType>', reqBody.IdentifierType);
    const prospect_identifier = (await db.getRecord(prospect_identifier_query)).recordset

    if (prospect_identifier[0] === undefined) {
        return { error: `Prospect Record does not exist with IdentifierType as ${reqBody.IdentifierType} and IdentifierValue as ${reqBody.IdentifierValue} in the system` };
    }
    const prospectId = prospect_identifier[0].prospect_id;
    if (`${prospectId}` === `${headerProspectId}`) {
        const prospect_query = PROSPECT_IDENTIFIER_QUERY.PROSPECT_VALUES_BY_PROSPECT_ID
            .replace('<tableName>', TABLES.PROSPECT)
            .replace('<prospect_id>', prospectId);
        const prospect = (await db.getRecord(prospect_query)).recordset
        return { prospect, prospect_identifier }
    } else {
        return { "error": `Prospect with id ${prospectId} retrieved from request for identifier ${reqBody.IdentifierValue} could not match with the prospect id retrieved from db for x-aurhrazition-id header ${headerProspectId}` };
    }
}

async function findProspectById(req) {

    const reqParams = req.params;
    var prospectId = reqParams.ProspectId;
    console.log("prospectId : " + prospectId);
    //TO-DO needs to be integrated with Domus Cookie /validate api to get the session id, and read the value from "sub". For now mocked sub.
    //var X_Auth_ID = req.headers['x-authrization-id']; 
    // invoke /validate(X_Auth_ID.json as body)
    //var cookie = X_Auth_Find[1].sub;

    //var headerProspectId = await dbService.getProspectWithSessionId(cookie);

    var usertype = X_Auth_Find[0].userType
    var headerProspectId;
    if (usertype === 'UNAUTH_CUSTOMER') {
        headerProspectId = await dbService.getProspectWithSessionId(X_Auth_Find[0].sub)
    } else if (usertype === 'IB_CUSTOMER') {
        headerProspectId = await dbService.getProspectWithIBID(X_Auth_Find[0].sub)
    }

    //if prospect id is null for x-aurhrazition-id header return error message
    if (headerProspectId == null) {
        return { "error": `Prospect could not found with SESSIONID ${X_Auth_Find[0].sub} in the system` };
    }
    //check below,
    //prospect id retrieved from db for x-aurhrazition-id header is not null and 
    //prospect id from uri is matching with prospect id retrieved from db for x-aurhrazition-id header
    if (`${prospectId}` === `${headerProspectId}`) {
        const prospect_query = PROSPECT_IDENTIFIER_QUERY.PROSPECT_VALUES_BY_PROSPECT_ID
            .replace('<tableName>', TABLES.PROSPECT)
            .replace('<prospect_id>', prospectId);

        const prospect_identifier_query = PROSPECT_IDENTIFIER_QUERY.PROSPECT_IDENTIFIER_VALUES_BY_PROSPECT_ID
            .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
            .replace('<prospect_id>', prospectId);

        var prospect = (await db.getRecord(prospect_query)).recordset
        var prospect_identifiers = (await db.getRecord(prospect_identifier_query)).recordset

        return { prospect, prospect_identifiers }
    } else {
        return { "error": `Prospect id from uri ${prospectId} could not match with the prospect id retrieved from db for x-aurhrazition-id header ${headerProspectId}` };
    }
}



// exporting modules, to be used in the other .js files
module.exports = { findProspect, findProspectById };