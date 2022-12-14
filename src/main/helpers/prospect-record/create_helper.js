let PROSPECT_IDENTIFIER_QUERY = require('../../variables/queries.js').TBL_PROSPECT_IDENTIFIER_QUERY;
const PROSPECT_IDENTIFIER_HELPER = require('./prospect_identifier_helper.js');
const PROSPECT_HELPER = require('../prospect/prospect_helper.js');
const TABLES = require('../../variables/tables.js').TABLES;
const db = require('../../utils/azureSql.js');
const HTTP = require('../../variables/status.js').HTTP;

/* Building a Response Payload to be sent back by the API.
   return [response_status_code, response_message]
   response_status_code: contains the response status code
   response_message: contains the response message
*/

/* if the prospectid doesn't exist
   the function will create new record in prospect and prospect identifier tables
*/

async function getResponse(X_Auth, req) {

    var ProspectIdfromDB
    var usertype = X_Auth[0].userType

    //Based on the usertype the tables will distinguish between Prospect with sessionid and Prospect with IBID 
    if (usertype === 'UNAUTH_CUSTOMER') {
        ProspectIdfromDB = await PROSPECT_IDENTIFIER_HELPER.getProspectWithSessionId(X_Auth[0].sub)
    } else if (usertype === 'IB_CUSTOMER') {
        ProspectIdfromDB = await PROSPECT_IDENTIFIER_HELPER.getProspectWithIBID(X_Auth[0].sub)
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
        //creating new prospectidentifierid
        var prevProspectIdentifierId = await PROSPECT_IDENTIFIER_HELPER.getMaxProspectIdenId();
        var newProspectIdentifierId = PROSPECT_IDENTIFIER_HELPER.getNextProspectIdenId(prevProspectIdentifierId)
        var usertype = X_Auth[0].userType

        //Adding new record in prospect identifier table based on the usertype
        if (usertype === 'UNAUTH_CUSTOMER') {
            var insertProspectIdentifierQuery = PROSPECT_IDENTIFIER_QUERY.INSERT_PROSPECT_IDENTIFIERS
                .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
                .replace('<prospect_identifier_id>', newProspectIdentifierId)
                .replace('<prospect_id>', newProspectId)
                .replace('<identifier_type>', 'SessionId')
                .replace('<identifier>', X_Auth[0].sub)

        } else {
            var insertProspectIdentifierQuery = PROSPECT_IDENTIFIER_QUERY.INSERT_PROSPECT_IDENTIFIERS
                .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
                .replace('<prospect_identifier_id>', newProspectIdentifierId)
                .replace('<prospect_id>', newProspectId)
                .replace('<identifier_type>', 'IBID')
                .replace('<identifier>', X_Auth[0].sub)
        }

        const prospectIdentifierInsertResult = await db.insertRecord(insertProspectIdentifierQuery);

        response_status_code = HTTP.OK.code;
        response_message = { message: `ProspectId ${newProspectId} is created successfully` };
        return [response_status_code, response_message];

    } else {
        response_status_code = HTTP.OK.code;
        response_message = { message: `ProspectId: ${ProspectIdfromDB}, already exist in the system.` };
        return [response_status_code, response_message];
    }

}

module.exports = { getResponse };