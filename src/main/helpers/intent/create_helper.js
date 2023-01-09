const TABLES = require('../../variables/tables.js').TABLES;
const db = require('../../utils/azureSql.js');
const HTTP = require('../../variables/status.js').HTTP;
const PROSPECT_HELPER = require('../prospect/prospect_helper.js');
INTENT_HELPER = require('../intent/intent_helper.js');
let INTENT_QUERY = require('../../variables/queries.js').TBL_INTENT_QUERY;

/*this function will give max intent_id which is present in the intent table
*/
function getNextIntentId(intentId) {
    return (intentId == 'INTnull') ? 'INT1'
        : 'INT' + (parseInt(intentId.substring(3)) + 1);
}

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

    //Intent is only inserted if the prospectid already exist in the records
    var isprospectpresent = await PROSPECT_HELPER.isProspectPresent(req.params.ProspectId);
    var isintentpresent = await INTENT_HELPER.isIntentPresent(req.params.ProspectId);

    if(isintentpresent){
        response_status_code = HTTP.OK.code;
        response_message = { message: `Intent with ProspectId: ${req.params.ProspectId}, already exist in the system.` };
        return [response_status_code, response_message];
    }

    if(isprospectpresent){ 
        //creating new intentid
        var prevIntentId = await INTENT_HELPER.getMaxIntentId();
        var newIntentId = getNextIntentId(prevIntentId);

        const insertIntentQuery = INTENT_QUERY.INSERT_INTENT
            .replace('<tableName>', TABLES.INTENT) 
            .replace('<intent_id>', newIntentId)
            .replace('<prospect_id>', req.params.ProspectId)
            .replace('<intent_questionaire_payload>', req.body.intent_questionaire_payload)
            .replace('<active_from>', req.body.active_from);
        const intentInsertResult = await db.insertRecord(insertIntentQuery);

        response_status_code = HTTP.OK.code;
        response_message = { message: `IntentId ${newIntentId} is created successfully` };
        return [response_status_code, response_message];

    }else{

        response_status_code = HTTP.BAD_REQUEST.code;
        response_message = { error: `Prospect with ProspectId: ${req.params.ProspectId}, does not exist in the records.` };
        return [response_status_code, response_message];
    }

}

module.exports = { getResponse };