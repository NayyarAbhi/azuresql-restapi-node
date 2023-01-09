let PROSPECT_QUERY = require('../../variables/queries.js').TBL_PROSPECT_QUERY;
const TABLES = require('../../variables/tables.js').TABLES;
const db = require('../../utils/azureSql.js');

/*this function will give max prospect_identifier_id which is present in the prospect_identifier table
*/
async function getMaxProspectIdenId() {
    const query = PROSPECT_QUERY.GET_PROSPECT_IDENTIFIER_ID
        .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS);
    return 'PID' + ((await db.getRecord(query))
        .recordset[0].MAXPROSPECTIDENTIFIERID);
}

/*this function will check the max prospect_identifier_id and return the next prospect_identifier_id to be added
*/
function getNextProspectIdenId(prospectIdenId) {
    return (prospectIdenId == 'PIDnull') ? 'PID1'
        : 'PID' + (parseInt(prospectIdenId.substring(3)) + 1);
}

/*This function with return the prospect with the given sessionId from prospect_identifier_table
*/
async function getProspectWithSessionId(SessionId) {
    const query = PROSPECT_QUERY.GET_PROSPECT_WITH_SESSION_ID
        .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
        .replace('<identifier>', SessionId);

    var record = (await db.getRecord(query))
        .recordset[0];

    if (record != null) {
        return record.prospect_id;
    } else {
        return null;
    }
}

/*This function with return the prospect with the given IBID from prospect_identifier_table
*/
async function getProspectWithIBID(IBID) {
    const query = PROSPECT_QUERY.GET_PROSPECT_WITH_IBID
        .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
        .replace('<identifier>', IBID);

    var record = (await db.getRecord(query))
        .recordset[0];
    if (record != null) {
        return record.prospect_id;
    } else {
        return null;
    }
}

// exporting modules, to be used in the other .js files
module.exports = { getMaxProspectIdenId, getNextProspectIdenId, getProspectWithSessionId, getProspectWithIBID };