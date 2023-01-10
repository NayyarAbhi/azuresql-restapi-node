let INTENT_QUERY = require('../../variables/queries.js').TBL_INTENT_QUERY;
const TABLES = require('../../variables/tables.js').TABLES;
const db = require('../../utils/azureSql.js');


/* checking if a Prospect present in the Intent table
*/
async function isIntentPresent(prospectId) {
    const query = INTENT_QUERY.RECORD_COUNT
        .replace('<tableName>', TABLES.INTENT)
        .replace('<prospectId>', prospectId);

    return (await db.getRecord(query))
        .recordset[0].RECORD_COUNT !== 0 ? true : false;
}

/* getting max IntentId from the Prospect table
*/
async function getMaxIntentId() {
    const query = INTENT_QUERY.GET_MAX_INTENT_ID
        .replace('<tableName>', TABLES.INTENT);
    return 'INT' + ((await db.getRecord(query))
        .recordset[0].MAXINTENTID);
}

/*This function with return the Intent Data with the given prospectId and intentId from tbl_intent
*/
async function getIntentWithIntentId(prospectId, intentId) {
    const query = INTENT_QUERY.GET_INTENT_BY_INTENTID
        .replace('<tableName>', TABLES.INTENT)
        .replace('<prospectId>', prospectId)
        .replace('<intentId>', intentId);
    console.log("\ngetIntentWithIntentId query: \n" + query);

    var data = (await db.getRecord(query)).recordset;

    if (data != null) {
        return data;
    } else {
        return null;
    }
}

/*This function with return the Intent Data with the given prospectId and intentId from tbl_intent
*/
async function getActiveIntentData(prospectId) {
    const query = INTENT_QUERY.GET_ACTIVE_INTENT_BY_PROSPECTID
        .replace('<tableName>', TABLES.INTENT)
        .replace('<prospectId>', prospectId);
    console.log("\ngetActiveIntentData query: \n" + query);

    var data = (await db.getRecord(query)).recordset;

    if (data != null) {
        return data;
    } else {
        return null;
    }
}

// exporting modules, to be used in the other .js files
module.exports = { isIntentPresent, getMaxIntentId, getIntentWithIntentId, getActiveIntentData };
