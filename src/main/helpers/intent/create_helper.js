const TABLES = require('../../variables/tables.js').TABLES;
const db = require('../../utils/azureSql.js');
const HTTP = require('../../variables/status.js').HTTP;
const PROSPECT_HELPER = require('../prospect/prospect_helper.js');
const PROSPECT_IDENTIFIER_HELPER = require('../prospect-record/prospect_identifier_helper.js');
const INTENT_HELPER = require('../intent/intent_helper.js');
let INTENT_QUERY = require('../../variables/queries.js').TBL_INTENT_QUERY;


/* Building a Response Payload to be sent back by the API.
   return [response_status_code, response_message]
   response_status_code: contains the response status code
   response_message: contains the response message
*/
/* if the prospectid doesn't exist in the records the function will do nothing and will return the same
   if the prospect with intentid already exist in the intent table then the function will do nothing and return the same
   else the function will create new record in intent table
*/
async function getResponse(X_Auth, req) {
    var ProspectIdfromDB;
    var usertype = X_Auth[0].userType
    //Based on the usertype the tables will distinguish between Prospect with sessionid and Prospect with IBID 
    //this is to validate prospectid via x_auth is same as the prospectid in params or not
    if (usertype === 'UNAUTH_CUSTOMER') {
        ProspectIdfromDB = await PROSPECT_IDENTIFIER_HELPER.getProspectWithSessionId(X_Auth[0].sub)
    } else if (usertype === 'IB_CUSTOMER') {
        ProspectIdfromDB = await PROSPECT_IDENTIFIER_HELPER.getProspectWithIBID(X_Auth[0].sub)
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
    //Intent is only inserted if the prospectid already exist in the prospect table
    var isprospectpresent = await PROSPECT_HELPER.isProspectPresent(req.params.ProspectId);
    var isintentpresent = await INTENT_HELPER.isIntentPresent(req.params.ProspectId);
    //do not insert if intent already exist with respect to the prospectid
    if (isintentpresent) {
        response_status_code = HTTP.OK.code;
        response_message = { message: `Intent with ProspectId, already exist in the system.` };
        return [response_status_code, response_message];
    }
    if (isprospectpresent) {
        //creating new intentid
        var prevIntentId = await INTENT_HELPER.getMaxIntentId();
        var newIntentId = INTENT_HELPER.getNextIntentId(prevIntentId);
        var intent_questionaire_payload_string = JSON.stringify(req.body.intent_questionaire_payload);
        //inserting new intent record in the intent table
        const insertIntentQuery = INTENT_QUERY.INSERT_INTENT
            .replace('<tableName>', TABLES.INTENT)
            .replace('<intent_id>', newIntentId)
            .replace('<prospect_id>', req.params.ProspectId)
            .replace('<intent_questionaire_payload>', intent_questionaire_payload_string)
            .replace('<active_from>', req.body.active_from);
        const intentInsertResult = await db.insertRecord(insertIntentQuery);
        response_status_code = HTTP.OK.code;
        response_message = { message: `IntentId ${newIntentId} is created successfully` };
        return [response_status_code, response_message];
    } else {
        response_status_code = HTTP.BAD_REQUEST.code;
        response_message = { error: `Prospect with ProspectId, does not exist in the records.` };
        return [response_status_code, response_message];
    }
}

module.exports = { getResponse };