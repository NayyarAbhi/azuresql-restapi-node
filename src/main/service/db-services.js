let PROSPECT_QUERY = require('../variables/prospect_sql.js').QUERY;
const TABLES = require('../variables/tables.js').TABLES;
const db = require('../utils/azureSql.js');

async function getProspectWithSessionId(SessionId){
    const query = PROSPECT_QUERY.GET_PROSPECT_WITH_SESSION_ID
        .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
        .replace('<identifier>', SessionId);
    console.log(query)

    var record =  (await db.getRecord(query))
        .recordset[0];
        
    if (record != null) {
        return record.prospect_id;
    } else {
        return null;
    }
}

// exporting modules, to be used in the other .js files
module.exports = { getProspectWithSessionId };