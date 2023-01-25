let PROSPECT_IDENTIFIER_QUERY = require('../../variables/queries.js').TBL_PROSPECT_IDENTIFIER_QUERY;
const PROSPECT_IDENTIFIER_HELPER = require('./prospect_identifier_helper.js');
const PROSPECT_HELPER = require('../prospect/prospect_helper.js');
const TABLES = require('../../variables/tables.js').TABLES;
const db = require('../../utils/azureSql.js');
const HTTP = require('../../variables/status.js').HTTP;
const validator = require('../../validator/prospectValidator');

/* Building a Response Payload to be sent back by the API.
   return [response_status_code, response_message]
   response_status_code: contains the response status code
   response_message: contains the response message
*/

/* if the prospectid doesn't exist
   the function will create new record in prospect and prospect identifier tables
*/

async function getResponse(domus_cookie_response, req) {

    var ProspectIdfromDB
    var usertype = domus_cookie_response.userType
    //console.log(req)

    //Based on the usertype the tables will distinguish between Prospect with sessionid and Prospect with IBID 
    if (usertype === 'UNAUTH_CUSTOMER') {
        ProspectIdfromDB = await PROSPECT_IDENTIFIER_HELPER.getProspectWithSessionId(domus_cookie_response.sub)
    } else if (usertype === 'IB_CUSTOMER') {
        ProspectIdfromDB = await PROSPECT_IDENTIFIER_HELPER.getProspectWithIBID(domus_cookie_response.sub)
    } else {
        response_status_code = HTTP.BAD_REQUEST.code;
        response_message = { error: `Auth userType: ${usertype}, is not valid.` };
        return [response_status_code, response_message];
    }

    //Adding new record in prospect table if the prospect doesn't exist
    if (ProspectIdfromDB == null) {
        //creating new prospectid
        var prevProspectId = await PROSPECT_HELPER.getMaxProspectId();

        var newProspectId = prevProspectId == null ? 10000000 : (parseInt(prevProspectId) + 1);
        const insertProspectQuery = PROSPECT_IDENTIFIER_QUERY.INSERT_PROSPECT
            .replace('<tableName>', TABLES.PROSPECT)
            .replace('<prospect_id>', newProspectId)
            .replace('<first_name>', req.body.first_name == undefined ? '' : req.body.first_name)
            .replace('<created_on>', req.body.created_on)
            .replace('<brand_identifier>', req.body.brand_identifier)
            .replace('<channel_identifier>', req.body.channel_identifier == undefined ? '' : req.body.channel_identifier);

        const prospectInsertResult = await db.insertRecord(insertProspectQuery);

        var prevProspectIdentifierId = await PROSPECT_IDENTIFIER_HELPER.getMaxProspectIdenId();
        var newProspectIdentifierId = PROSPECT_IDENTIFIER_HELPER.getNextProspectIdenId(prevProspectIdentifierId)
        var usertype = domus_cookie_response.userType

        //Adding new record in prospect identifier table based on the usertype
        if (usertype === 'UNAUTH_CUSTOMER') {
            var insertProspectIdentifierQuery = PROSPECT_IDENTIFIER_QUERY.INSERT_PROSPECT_IDENTIFIERS
                .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
                .replace('<prospect_identifier_id>', newProspectIdentifierId)
                .replace('<prospect_id>', newProspectId)
                .replace('<identifier_type>', 'SessionId')
                .replace('<identifier>', domus_cookie_response.sub)

        } else {
            var insertProspectIdentifierQuery = PROSPECT_IDENTIFIER_QUERY.INSERT_PROSPECT_IDENTIFIERS
                .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
                .replace('<prospect_identifier_id>', newProspectIdentifierId)
                .replace('<prospect_id>', newProspectId)
                .replace('<identifier_type>', 'IBID')
                .replace('<identifier>', domus_cookie_response.sub)
        }


        const prospectIdentifierInsertResult = await db.insertRecord(insertProspectIdentifierQuery);

        response_status_code = HTTP.OK.code;
        response_message = { message: `ProspectId ${newProspectId} is created successfully` };
        return [response_status_code, response_message];

    } else {
        response_status_code = HTTP.BAD_REQUEST.code;
        response_message = { message: `ProspectId, already exist in the system.` };
        return [response_status_code, response_message];
    }

}


async function xAauthValidation(authObj, req) {
    if (error = (validator.validateXAuthHeader(authObj) || validator.validateCreatePayload(req))) {
        response_status_code = HTTP.BAD_REQUEST.code;
        return [response_status_code, error.details];
    }
    else {
        response_status_code = HTTP.OK.code;
        response_message = "X_AUTH passes";
        return [response_status_code, response_message];
    }
}

module.exports = { getResponse, xAauthValidation };