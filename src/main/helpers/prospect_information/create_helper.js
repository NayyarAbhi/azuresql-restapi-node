const TABLES = require('../../variables/tables.js').TABLES;
const db = require('../../utils/azureSql.js');
const HTTP = require('../../variables/status.js').HTTP;
const PROSPECT_HELPER = require('../prospect/prospect_helper.js');
const PROSPECT_IDENTIFIER_HELPER = require('../prospect_record/prospect_identifier_helper.js');
const PROSPECT_INFORMATION_HELPER = require('../prospect_information/prospect_info_helper.js');
let PROSPECT_INFORMATION_QUERY = require('../../variables/queries.js').TBL_PROSPECT_INFORMATION_QUERY;
const validator = require('../../validator/prospectInformationValidator');



/* Building a Response Payload to be sent back by the API.
   return [response_status_code, response_message]
   response_status_code: contains the response status code
   response_message: contains the response message
*/
/* 
*/
async function getResponse(domus_cookie_response, req) {
    var ProspectIdfromDB;
    var usertype = domus_cookie_response.userType
    //Based on the usertype the tables will distinguish between Prospect with sessionid and Prospect with IBID 
    //this is to validate prospectid via x_auth is same as the prospectid in params or not
    if (usertype === 'UNAUTH_CUSTOMER') {
        ProspectIdfromDB = await PROSPECT_IDENTIFIER_HELPER.getProspectWithSessionId(domus_cookie_response.sub)
    } else if (usertype === 'IB_CUSTOMER') {
        ProspectIdfromDB = await PROSPECT_IDENTIFIER_HELPER.getProspectWithIBID(domus_cookie_response.sub)
    } else {
        response_status_code = HTTP.BAD_REQUEST.code;
        response_message = { error: `Auth userType is not valid.` };
        return [response_status_code, response_message];
    }

    if (ProspectIdfromDB == null) {
        response_status_code = HTTP.NOT_FOUND.code;
        response_message = { error: `Prospect with userType and sub doesn't exist in the records` };
        return [response_status_code, response_message];
    } else if (ProspectIdfromDB != req.params.ProspectId) {
        response_status_code = HTTP.NOT_FOUND.code;
        response_message = { error: `ProspectId in the request is not associated with userType and sub` };
        return [response_status_code, response_message];
    }

    //Prospect Information is only inserted if the prospectid already exist in the prospect table
    var isprospectpresent = await PROSPECT_HELPER.isProspectPresent(req.params.ProspectId);
    var isprospectinfopresent = await PROSPECT_INFORMATION_HELPER.isProspectInfoPresent(req.params.ProspectId);

    //do not insert if prospect Info already exist with respect to the prospectid
    if (isprospectinfopresent) {
        console.log("prospect info is present")
        const [response_status_code, response_message] = await updateProspectInfo(domus_cookie_response, req);
        return [response_status_code, response_message];

    }
    if (isprospectpresent) {
        //creating new payloadid
        var newPayloadId = PROSPECT_INFORMATION_HELPER.getNextPayloadId(await PROSPECT_INFORMATION_HELPER.getMaxPayloadId());
        var payload_string = JSON.stringify(req.body.payload_body);
        //inserting new prospect Information record in the intent table
        const insertProspectInfoQuery = PROSPECT_INFORMATION_QUERY.INSERT_PROSPECT_INFORMATION
            .replace('<tableName>', TABLES.PROSPECT_INFORMATION)
            .replace('<payload_id>', newPayloadId)
            .replace('<prospect_id>', req.params.ProspectId)
            .replace('<payload_identifier>', req.body.payload_identifier)
            .replace('<payload_body>', payload_string)
            .replace('<active_from>', req.body.active_from);

        const prospectInfoInsertResult = await db.insertRecord(insertProspectInfoQuery);
        response_status_code = HTTP.OK.code;
        response_message = { message: `PayloadId ${newPayloadId} is created successfully` };
        return [response_status_code, response_message];
    } else {
        response_status_code = HTTP.BAD_REQUEST.code;
        response_message = { error: `Prospect with ProspectId, does not exist in the Prospect table records.` };
        return [response_status_code, response_message];
    }
}


async function updateProspectInfo(domus_cookie_response, req) {

    //update record for prospect when prospect information with prospectid exists
    let response_status_code;
    let response_message;
    const reqProspectId = req.params.ProspectId;
    const reqPayload = req.body;


    /* checking if Prospect Info is active in tbl_prospect_information, and returning 404, if not active */
    if (!(await isProspectInfoActive(reqProspectId))) {
        response_status_code = HTTP.NOT_FOUND.code;
        response_message = { error: `No Active Prospect Info Record found with ProspectId ` };
        return [response_status_code, response_message];
    }

    /* getting final response status and reponse payload */
    [response_status_code, response_message] = await updateInfo(reqProspectId, reqPayload)
    return [response_status_code, response_message];

}


/* checking if a Intent is active in tbl_intent
*/
async function isProspectInfoActive(prospectId) {
    const query = PROSPECT_INFORMATION_QUERY.IS_PROSPECT_INFO_ACTIVE
        .replace('<tableName>', TABLES.PROSPECT_INFORMATION)
        .replace('<prospectId>', prospectId);
    console.log("\nisProspectInfoActive query: \n" + query);

    return (await db.getRecord(query))
        .recordset[0].ACTIVE_PROSPECT_INFO_COUNT !== 0 ? true : false;
}


async function updateInfo(prospectId, reqPayload) {

    if (Object.keys(reqPayload).length !== 0) {
        await updateActiveTo(prospectId);
        [response_status_code, response_message] = await addProspectInfoRecord(prospectId, reqPayload);
    } else {
        response_status_code = HTTP.NOT_FOUND.code;
        response_message = { error: `Payload should not be empty ` };
    }

    /* returing 200 response along with response payload */
    return [response_status_code, response_message];
}

/* archiving the previous records by populating the ActiveTo column in tbl_intent table
*/
async function updateActiveTo(prospectId) {
    const updateQuery = PROSPECT_INFORMATION_QUERY.UPDATE_ACTIVETO
        .replace('<tableName>', TABLES.PROSPECT_INFORMATION)
        .replace('<prospectId>', prospectId);
    console.log("\nupdate ActiveTo Query tbl_prospect_info: \n" + updateQuery)
    await db.updateRecord(updateQuery);
}

/* adding new Intent details to the tbl_intent table
*/
async function addProspectInfoRecord(prospectId, reqPayload) {

    var newPayloadId = PROSPECT_INFORMATION_HELPER.getNextPayloadId(await PROSPECT_INFORMATION_HELPER.getMaxPayloadId());
        var payload_string = JSON.stringify(reqPayload.payload_body);
        const insertProspectInfoQuery = PROSPECT_INFORMATION_QUERY.INSERT_PROSPECT_INFORMATION
            .replace('<tableName>', TABLES.PROSPECT_INFORMATION)
            .replace('<payload_id>', newPayloadId)
            .replace('<prospect_id>', prospectId)
            .replace('<payload_identifier>',reqPayload.payload_identifier)
            .replace('<payload_body>', payload_string)
            .replace('<active_from>', reqPayload.active_from);

        const prospectInfoInsertResult = await db.insertRecord(insertProspectInfoQuery);
        response_status_code = HTTP.OK.code;
        response_message = { message: `Prospect Information with new PayloadId ${newPayloadId} is updated successfully` };
        return [response_status_code, response_message];

}

async function xAauthValidation(authObj, req) {
    if (error = (validator.validateXAuthHeader(authObj) || validator.validateCreateProspectInfo(req) || validator.validateProspectId(req.params))) {
        response_status_code = HTTP.BAD_REQUEST.code;
        return [response_status_code, error.details];
    }
    else {
        response_status_code = HTTP.OK.code;
        response_message = "X_AUTH passes";
        console.log(response_message)
        return [response_status_code, response_message];
    }
}

module.exports = { getResponse,xAauthValidation };