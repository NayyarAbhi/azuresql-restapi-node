let PROSPECT_QUERY = require('../../variables/queries.js').TBL_PROSPECT_QUERY;
const TABLES = require('../../variables/tables.js').TABLES;
const db = require('../../utils/azureSql.js');


async function getMaxProspectIdenId() {
    const query = PROSPECT_QUERY.GET_PROSPECT_IDENTIFIER_ID
        .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS);
    return 'PID' + ((await db.getRecord(query))
        .recordset[0].MAXPROSPECTIDENTIFIERID);
}

function getNextProspectIdenId(prospectIdenId) {
    return (prospectIdenId == 'PIDnull') ? 'PID1'
        : 'PID' + (parseInt(prospectIdenId.substring(3)) + 1);
}

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