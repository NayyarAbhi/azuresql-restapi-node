let PROSPECT_QUERY = require('../../variables/prospect_sql.js').QUERY;
const PROSPECT_IDENTIFIER_HELPER = require('./prospect_identifier_helper.js');
const PROSPECT_HELPER = require('../prospect/prospect_helper.js');
const TABLES = require('../../variables/tables.js').TABLES;
const db = require('../../utils/azureSql.js');
const HTTP = require('../../variables/status.js').HTTP;


async function getResponse(X_Auth, req){

    var ProspectIdfromDB
    var usertype = X_Auth[0].userType
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
        var prevProspectId = await PROSPECT_HELPER.getMaxProspectId();
        var newProspectId = prevProspectId == null ? 10000000 : (parseInt(prevProspectId) + 1);
        const insertProspectQuery = PROSPECT_QUERY.INSERT_PROSPECT
            .replace('<tableName>', TABLES.PROSPECT)
            .replace('<prospect_id>', newProspectId)
            .replace('<first_name>', req.body.first_name == undefined ? '' : req.body.first_name)
            .replace('<created_on>', req.body.created_on)
            .replace('<brand_identifier>', req.body.brand_identifier)
            .replace('<channel_identifier>', req.body.channel_identifier == undefined ? '' : req.body.channel_identifier);

        const prospectInsertResult = await db.insertRecord(insertProspectQuery);

        var prevProspectIdentifierId = await PROSPECT_IDENTIFIER_HELPER.getMaxProspectIdenId();
        var newProspectIdentifierId = PROSPECT_IDENTIFIER_HELPER.getNextProspectIdenId(prevProspectIdentifierId)

        var usertype = X_Auth[0].userType
        if (usertype === 'UNAUTH_CUSTOMER') {
            var insertProspectIdentifierQuery = PROSPECT_QUERY.INSERT_PROSPECT_IDENTIFIERS
                .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
                .replace('<prospect_identifier_id>', newProspectIdentifierId)
                .replace('<prospect_id>', newProspectId)
                .replace('<identifier_type>', 'SessionId')
                .replace('<identifier>', X_Auth[0].sub)

        } else {
            var insertProspectIdentifierQuery = PROSPECT_QUERY.INSERT_PROSPECT_IDENTIFIERS
                .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
                .replace('<prospect_identifier_id>', newProspectIdentifierId)
                .replace('<prospect_id>', newProspectId)
                .replace('<identifier_type>', 'IBID')
                .replace('<identifier>', X_Auth[0].sub)
        }

        const prospectIdentifierInsertResult = await db.insertRecord(insertProspectIdentifierQuery);

        response_status_code = HTTP.OK.code;
        response_message = {message: `ProspectId ${newProspectId} is created successfully` };
        return [response_status_code, response_message];

    } else {
        response_status_code = HTTP.OK.code;
        response_message = { message: `ProspectId: ${ProspectIdfromDB}, already exist in the system.` };
        return [response_status_code, response_message];
    }

}

module.exports = { getResponse };