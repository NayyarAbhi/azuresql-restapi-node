let PROSPECT_IDENTIFIER_QUERY = require('../../variables/queries.js').TBL_PROSPECT_IDENTIFIER_QUERY;
const TABLES = require('../../variables/tables.js').TABLES;
const db = require('../../utils/azureSql.js');
const cookie = require('../../validator/cookieValidator.js');
let X_Auth_Find = require('../../variables/x-auth-id-find.json');

async function findProspect(req) {
    const reqBody = req.body;

    var headerProspectId = await cookie.validateCookie(X_Auth_Find[0].userType,X_Auth_Find[0].sub);
    //var headerProspectId = await dbService.getProspectWithSessionId(cookie);
    //if prospect id is null for x-aurhrazition-id header return error message
    if (headerProspectId == null) {
        return { "error": `Prospect could not found in the system` };
    }
    const prospect_identifier_query = PROSPECT_IDENTIFIER_QUERY.PROSPECT_IDENTIFIER_VALUES_BY_IDENTIFIER_TYPE_AND_VALUE
        .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
        .replace('<IdentifierValue>', reqBody.IdentifierValue)
        .replace('<IdentifierType>', reqBody.IdentifierType);
    const prospect_identifier = (await db.getRecord(prospect_identifier_query)).recordset

    if (prospect_identifier[0] === undefined) {
        return { error: `Prospect Record does not exist with IdentifierType and IdentifierValue in the system` };
    }
    const prospectId = prospect_identifier[0].prospect_id;
    if (`${prospectId}` === `${headerProspectId}`) {
        const prospect_query = PROSPECT_IDENTIFIER_QUERY.PROSPECT_VALUES_BY_PROSPECT_ID
            .replace('<tableName>', TABLES.PROSPECT)
            .replace('<prospect_id>', prospectId);
        const prospect = (await db.getRecord(prospect_query)).recordset
        return { prospect, prospect_identifier }
    } else {
        //return { "error": `Prospect with id ${prospectId} retrieved from request for identifier ${reqBody.IdentifierValue} could not match with the prospect id retrieved from db for x-aurhrazition-id header ` + X_Auth_Find[0].sub};
        return { "error": `Prospect id could not found`};
    }
}

async function findProspectById(req) {

    const reqParams = req.params;
    var prospectId = reqParams.ProspectId;
    var headerProspectId = await cookie.validateCookie(X_Auth_Find[0].userType,X_Auth_Find[0].sub);

    //if prospect id is null for x-aurhrazition-id header return error message
    if (headerProspectId == null) {
        //return { "error": `Prospect could not found with SESSIONID ${X_Auth_Find[0].sub} in the system` };
        return { "error": `Prospect id could not found`};
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
        //return { "error": `Prospect id from uri ${prospectId} could not match with the prospect id retrieved from db for x-aurhrazition-id header ` + X_Auth_Find[0].sub };
        return { "error": `Prospect id could not found`};
    }
}



// exporting modules, to be used in the other .js files
module.exports = { findProspect, findProspectById };