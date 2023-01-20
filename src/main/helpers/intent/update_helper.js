const HTTP = require('../../variables/status.js').HTTP;
const PROSPECT_IDENTIFIER_HELPER = require('../prospect-record/prospect_identifier_helper');
const PROSPECT_HELPER = require('../prospect/prospect_helper.js');
const INTENT_HELPER = require('./intent_helper');
const INTENT_QUERY = require('../../variables/queries').TBL_INTENT_QUERY;
const TABLES = require('../../variables/tables').TABLES;
const db = require('../../utils/azureSql.js');

let newIntentId;

/* getting the ProspectId from the tbl_prospect_identifier table, with the help of Auth userType and sub
*/
async function getProspectId(userType, sub) {
    let prospectId;
    let invalid_auth_userType = false;
    switch (userType) {
        case 'UNAUTH_CUSTOMER':
            prospectId = await PROSPECT_IDENTIFIER_HELPER.getProspectWithSessionId(sub);
            break;
        default:
            invalid_auth_userType = true;
    }
    return { prospectId, invalid_auth_userType };
}

/* archiving the previous records by populating the ActiveTo column in tbl_intent table
*/
async function updateActiveTo(prospectId) {
    const updateQuery = INTENT_QUERY.UPDATE_ACTIVETO
        .replace('<tableName>', TABLES.INTENT)
        .replace('<prospectId>', prospectId);
    console.log("\nupdate ActiveTo Query tbl_intent: \n" + updateQuery)
    await db.updateRecord(updateQuery);
}

/* adding new Intent details to the tbl_intent table
*/
async function addIntentRecord(prospectId, reqPayload) {
    newIntentId = INTENT_HELPER.getNextIntentId(await INTENT_HELPER.getMaxIntentId());
    const intent_questionaire_payload = JSON.stringify(reqPayload.intent_questionaire_payload)

    const insertQuery = INTENT_QUERY.INSERT_INTENT
        .replace('<tableName>', TABLES.INTENT)
        .replace('<intent_id>', newIntentId)
        .replace('<prospect_id>', prospectId)
        .replace('<intent_questionaire_payload>', intent_questionaire_payload)
        .replace('<active_from>', reqPayload.active_from);
    console.log("\ninsertQuery tbl_intent:\n" + insertQuery);

    await db.insertRecord(insertQuery);
}

/* doing below operation in order to update a intent in the db.

Step1: Archiving (to maintain history) records by updating ActiveTo column in tbl_intent.
       Method Used --> updateActiveTo(prospectId)

Step2: Adding new Intent details in the tbl_intent.
       Method Used --> addIntentRecord(prospectId, reqPayload)
*/
async function updateIntent(prospectId, reqPayload) {

    if (Object.keys(reqPayload).length !== 0) {
        await updateActiveTo(prospectId);
        await addIntentRecord(prospectId, reqPayload);
    } else {
        console.log("\nPayload doesnot contain tbl_intent record to be updated");
    }

    /* returing 200 response along with response payload */
    response_status_code = HTTP.OK.code;
    response_message = { IntentId: newIntentId };
    return [response_status_code, response_message];
}


/* Building a Response Payload to be sent back by the API.
   return [response_status_code, response_message]
   response_status_code: contains the response status code
   response_message: contains the response message
*/
async function getResponse(domus_cookie_response, req) {
    let response_status_code;
    let response_message;
    const reqProspectId = req.params.ProspectId;
    const reqIntentId = req.params.IntentId;
    const reqPayload = req.body;
    const auth_userType = domus_cookie_response.userType;
    const auth_sub = domus_cookie_response.sub;
    const { prospectId, invalid_auth_userType } = await getProspectId(auth_userType, auth_sub);

    /* checking if auth_userType is valid or not, and returning 404, if invalid */
    if (invalid_auth_userType) {
        response_status_code = HTTP.BAD_REQUEST.code;
        response_message = { error: `Auth userType: ${auth_userType}, is not valid.` };
        return [response_status_code, response_message];
    }

    /* checking if Prospect is present in tbl_prospect_identifier table, and returning 404, if not present  */
    if (prospectId == null) {
        response_status_code = HTTP.NOT_FOUND.code;
        response_message = { error: `Prospect Record not found with userType and sub` };
        return [response_status_code, response_message];
    }

    /* checking if prospectId from tbl_prospect_identifier table is matching with prospectId in the request path, 
       and returning 404, if not matching */
    if (prospectId != reqProspectId) {
        response_status_code = HTTP.NOT_FOUND.code;
        response_message = { error: `ProspectId in the request is not associated with userType and sub` };
        return [response_status_code, response_message];
    }

    /* checking if Prospect is present in tbl_prospect, and returning 404, if not present */
    if (!(await PROSPECT_HELPER.isProspectPresent(prospectId))) {
        response_status_code = HTTP.NOT_FOUND.code;
        response_message = { error: `Prospect Record not found in Prospect table` };
        return [response_status_code, response_message];
    }

    /* checking if Intent is active in tbl_intent, and returning 404, if not active */
    if (!(await INTENT_HELPER.isIntentActive(reqProspectId, reqIntentId))) {
        response_status_code = HTTP.NOT_FOUND.code;
        response_message = { error: `No Active Intent Record found with ProspectId and IntentId` };
        return [response_status_code, response_message];
    }

    /* getting final response status and reponse payload */
    [response_status_code, response_message] = await updateIntent(reqProspectId, reqPayload)
    return [response_status_code, response_message];
}

// exporting modules, to be used in the intentController.js file
module.exports = { getResponse };
