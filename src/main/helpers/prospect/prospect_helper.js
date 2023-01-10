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

/* getting prospect Data with the help of ProspectId from the Prospect table
*/
async function getProspectData(prospectId) {
    const query = PROSPECT_QUERY.GET_PROSPECT_DATA
        .replace('<tableName>', TABLES.PROSPECT)
        .replace('<prospectId>', prospectId);
    console.log("getProspectData query:\n" + query);

    return (await db.getRecord(query)).recordset;
}

// exporting modules, to be used in the other .js files
module.exports = { isProspectPresent, getMaxProspectId, getProspectData };
