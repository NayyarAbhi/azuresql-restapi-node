let PROSPECT_QUERY = require('../../variables/queries.js').TBL_PROSPECT_QUERY;
const TABLES = require('../../variables/tables.js').TABLES;
const db = require('../../utils/azureSql.js');


/* checking if a Prospect present in the Prospect table
*/
async function isProspectPresent(prospectId) {
    const query = PROSPECT_QUERY.RECORD_COUNT
        .replace('<tableName>', TABLES.PROSPECT)
        .replace('<prospectId>', prospectId);

    return (await db.getRecord(query))
        .recordset[0].RECORD_COUNT !== 0 ? true : false;
}

/* getting max ProspectId from the Prospect table
*/
async function getMaxProspectId() {
    const query = PROSPECT_QUERY.GET_PROSPECT_ID
        .replace('<tableName>', TABLES.PROSPECT);
    return (await db.getRecord(query))
        .recordset[0].MAXPROSPECTID;
}

// exporting modules, to be used in the other .js files
module.exports = { isProspectPresent, getMaxProspectId };
