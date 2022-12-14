const HTTP = require('../../variables/status.js').HTTP;
const PROSPECT_IDENTIFIER_HELPER = require('../prospect-record/prospect_identifier_helper');
const PROSPECT_HELPER = require('../prospect/prospect_helper.js');
const INTENT_HELPER = require('../intent/intent_helper.js');


/* getting the ProspectId from the tbl_prospect_identifier table, with the help of Auth userType and sub
*/
async function getProspectId(userType, sub) {
    let prospectId;
    let invalid_auth_userType = false;
    switch (userType) {
        case 'UNAUTH_CUSTOMER':
            prospectId = await PROSPECT_IDENTIFIER_HELPER.getProspectWithSessionId(sub);
            break;
        case 'IB_CUSTOMER':
            prospectId = await PROSPECT_IDENTIFIER_HELPER.getProspectWithIBID(sub)
            break;
        default:
            invalid_auth_userType = true;
    }
    return { prospectId, invalid_auth_userType };
}

/* getting response status and response payload */
async function getResponseAndPayload(By, req, reqProspectId) {
    /* fetching prospect data from tbl_prospect table */
    let prospect = await PROSPECT_HELPER.getProspectData(reqProspectId);

    /*  fetching intent data from tbl_intent table */
    let intent = [];
    if (By === 'IntentIdProspectId') {
        const reqIntentId = req.params.IntentId;
        intent = await INTENT_HELPER.getIntentData(reqProspectId, reqIntentId);
        if (intent.length === 0) {
            response_status_code = HTTP.NOT_FOUND.code;
            response_message = { error: `No Intent Record found with ProspectId: ${reqProspectId} and IntentId: ${reqIntentId}` };
            return [response_status_code, response_message];
        }
    } else if (By === 'ProspectId') {
        intent = await INTENT_HELPER.getActiveIntentData(reqProspectId);
        if (intent.length === 0) {
            response_status_code = HTTP.NOT_FOUND.code;
            response_message = { error: `No Active Intent Record found with ProspectId: ${reqProspectId}` };
            return [response_status_code, response_message];
        }
    }

    /* returing 200 response along with response payload */
    response_status_code = HTTP.OK.code;
    response_message = { prospect, intent };
    return [response_status_code, response_message];
}


/* Building a Response Payload to be sent back by the API.
   return [response_status_code, response_message]
   response_status_code: contains the response status code
   response_message: contains the response message
*/
async function getResponse(X_Auth_Find, req, By) {
    let response_status_code;
    let response_message;
    const reqProspectId = req.params.ProspectId;
    const auth_userType = X_Auth_Find.userType;
    const auth_sub = X_Auth_Find.sub;
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
        response_message = { error: `Prospect Record not found with userType:${auth_userType} and sub: ${auth_sub}` };
        return [response_status_code, response_message];
    }

    /* checking if prospectId from tbl_prospect_identifier table is matching with prospectId in the request path, 
       and returning 404, if not matching */
    if (prospectId != reqProspectId) {
        response_status_code = HTTP.NOT_FOUND.code;
        response_message = { error: `ProspectId: ${reqProspectId} in the request is not associated with userType:${auth_userType} and sub: ${auth_sub}` };
        return [response_status_code, response_message];
    }

    /* checking if Prospect is present in tbl_prospect, and returning 404, if not present */
    if (!(await PROSPECT_HELPER.isProspectPresent(prospectId))) {
        response_status_code = HTTP.NOT_FOUND.code;
        response_message = { error: `Prospect Record not found in Prospect table with ProspectId: ${reqProspectId}` };
        return [response_status_code, response_message];
    }

    /* getting final response status and reponse payload */
    [response_status_code, response_message] = await getResponseAndPayload(By, req, reqProspectId)
    return [response_status_code, response_message];
}

// exporting modules, to be used in the intentController.js file
module.exports = { getResponse };
