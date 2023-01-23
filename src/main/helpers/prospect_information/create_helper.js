const TABLES = require('../../variables/tables.js').TABLES;
const db = require('../../utils/azureSql.js');
const HTTP = require('../../variables/status.js').HTTP;
const PROSPECT_HELPER = require('../prospect/prospect_helper.js');
const PROSPECT_IDENTIFIER_HELPER = require('../prospect_record/prospect_identifier_helper.js');
const PROSPECT_INFORMATION_HELPER = require('../prospect_information/prospect_info_helper.js');
let PROSPECT_INFORMATION_QUERY = require('../../variables/queries.js').TBL_PROSPECT_INFORMATION_QUERY;



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
        response_message = { error: `Auth userType: ${usertype}, is not valid.` };
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
        response_status_code = HTTP.OK.code;
        response_message = { message: `Payload with ProspectId, already exist in the system.` };
        return [response_status_code, response_message];

    }
    if (isprospectpresent) {
        //creating new payloadid
        var prevPayloadId = await PROSPECT_INFORMATION_HELPER.getMaxPayloadId();
        var newPayloadId = PROSPECT_INFORMATION_HELPER.getNextPayloadId(prevPayloadId);
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
        response_message = { error: `Prospect with ProspectId, does not exist in the records.` };
        return [response_status_code, response_message];
    }
}

module.exports = { getResponse };