let PROSPECT_INFORMATION_QUERYS = require('../../variables/queries.js').TBL_PROSPECT_INFORMATION_QUERY;
const TABLES = require('../../variables/tables.js').TABLES;
const db = require('../../utils/azureSql.js');
const dbService = require('../prospect-record/prospect_identifier_helper.js');
const cookie = require('../../validator/cookieValidator.js');

async function findProspectInfoByProspectId(domus_cookie_response, req) {
    const reqParams = req.params;
    var prospectId = reqParams.ProspectId;
    var headerProspectId = await cookie.validateCookie(domus_cookie_response.userType, domus_cookie_response.sub);
    //if prospect id is null for x-aurhrazition-id header return error message
    if (headerProspectId == null) {
        return { "error": `Prospect could not found in the system` };
    }
    //check below,
    //prospect id retrieved from db for x-aurhrazition-id header is not null and 
    //prospect id from uri is matching with prospect id retrieved from db for x-aurhrazition-id header
    if (`${prospectId}` === `${headerProspectId}`) {
        const prospect_information_query = PROSPECT_INFORMATION_QUERYS.GET_PROSPECT_INFORMATION_BY_PROSPECTID
            .replace('<tableName>', TABLES.PROSPECT_INFORMATION)
            .replace('<prospectId>', `${prospectId}`);
        var prospectInformations = (await db.getRecord(prospect_information_query)).recordset
        return { "ProspectID": `${prospectId}`, prospectInformations }
    } else {
        //return { "error": `Prospect id from uri ${prospectId} could not match with the prospect id retrieved from db for x-aurhrazition-id header ` + domus_cookie_response.sub };
        return { "error": `Prospect id could not found` };
    }
}


async function findProspectInfoByPayloadIdentifier(domus_cookie_response, req) {
    const reqParams = req.params;
    var prospectId = reqParams.ProspectId;
    var payloadIdentifier = reqParams.PayloadIdentifier;
    var headerProspectId = await cookie.validateCookie(domus_cookie_response.userType, domus_cookie_response.sub);

    //if prospect id is null for x-aurhrazition-id header return error message
    if (headerProspectId == null) {
        //return { "error": `Prospect could not found with SESSIONID ${domus_cookie_response.sub} in the system` };
        return { "error": `Prospect id could not found` };
    }
    //check below,
    //prospect id retrieved from db for x-aurhrazition-id header is not null and 
    //prospect id from uri is matching with prospect id retrieved from db for x-aurhrazition-id header
    if (`${prospectId}` === `${headerProspectId}`) {
        const prospect_information_query = PROSPECT_INFORMATION_QUERYS.GET_PROSPECT_INFORMATION_BY_PROSPECTID_AND_PAYLOAD_IDENTIFIER
            .replace('<tableName>', TABLES.PROSPECT_INFORMATION)
            .replace('<prospectId>', `${prospectId}`)
            .replace('<payloadIdentifier>', `${payloadIdentifier}`);
        var prospectInformation = (await db.getRecord(prospect_information_query)).recordset
        if (prospectInformation && prospectInformation.length > 0) {
            return { prospectInformation }
        } else {
            //return {"error":`Prospect Information for prospect id: ${prospectId} and payloadIdentifier: ${payloadIdentifier} could not found in the data base.`}
            return { "error": `Prospect Information could not found` };
        }
    } else {
        //return { "error": `Prospect id from uri ${prospectId} could not match with the prospect id retrieved from db for x-aurhrazition-id header ` + domus_cookie_response.sub };
        return { "error": `Prospect id could not match` };
    }
}

async function findProspectInfoByPayloadIdentifierAndPayloadId(domus_cookie_response, req) {
    const reqParams = req.params;
    var prospectId = reqParams.ProspectId;
    var payloadIdentifier = reqParams.PayloadIdentifier;
    var payloadId = reqParams.PayloadId;
    var headerProspectId = await cookie.validateCookie(domus_cookie_response.userType, domus_cookie_response.sub);

    //if prospect id is null for x-aurhrazition-id header return error message
    if (headerProspectId == null) {
        //return { "error": `Prospect could not found with SESSIONID ${domus_cookie_response.sub} in the system` };
        return { "error": `Prospect id could not found` };
    }
    //check below,
    //prospect id retrieved from db for x-aurhrazition-id header is not null and 
    //prospect id from uri is matching with prospect id retrieved from db for x-aurhrazition-id header
    if (`${prospectId}` === `${headerProspectId}`) {
        const prospect_information_query = PROSPECT_INFORMATION_QUERYS.GET_PROSPECT_INFORMATION_BY_PROSPECTID_AND_PAYLOAD_IDENTIFIER_AND_PAYLOADID
            .replace('<tableName>', TABLES.PROSPECT_INFORMATION)
            .replace('<prospectId>', `${prospectId}`)
            .replace('<payloadIdentifier>', `${payloadIdentifier}`)
            .replace('<payloadId>', `${payloadId}`);
        var prospectInformation = (await db.getRecord(prospect_information_query)).recordset
        if (prospectInformation && prospectInformation.length > 0) {
            return { prospectInformation }
        } else {
            //return {"result":`Prospect Information for prospect id: ${prospectId}, payloadIdentifier: ${payloadIdentifier} and PayloadId: ${payloadId} could not found in the data base.`}
            return { "error": `Prospect Information could not found` };
        }
    } else {
        //return { "error": `Prospect id from uri ${prospectId} could not match with the prospect id retrieved from db for x-aurhrazition-id header ` + domus_cookie_response.sub };
        return { "error": `Prospect id could not found` };
    }
}
// exporting modules, to be used in the other .js files
module.exports = { findProspectInfoByProspectId, findProspectInfoByPayloadIdentifier, findProspectInfoByPayloadIdentifierAndPayloadId }