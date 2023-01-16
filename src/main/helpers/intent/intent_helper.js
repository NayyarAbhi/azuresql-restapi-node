let INTENT_QUERY = require('../../variables/queries.js').TBL_INTENT_QUERY;
const TABLES = require('../../variables/tables.js').TABLES;
const db = require('../../utils/azureSql.js');


/* checking if a Intent is present in tbl_intent
*/
async function isIntentPresent(prospectId) {
    const query = INTENT_QUERY.RECORD_COUNT
        .replace('<tableName>', TABLES.INTENT)
        .replace('<prospectId>', prospectId);

    return (await db.getRecord(query))
        .recordset[0].RECORD_COUNT !== 0 ? true : false;
}

/* checking if a Intent is active in tbl_intent
*/
async function isIntentActive(prospectId, intentId) {
    const query = INTENT_QUERY.IS_INTENT_ACTIVE
        .replace('<tableName>', TABLES.INTENT)
        .replace('<prospectId>', prospectId)
        .replace('<intentId>', intentId);
    console.log("\nisIntentActive query: \n" + query);

    return (await db.getRecord(query))
        .recordset[0].ACTIVE_INTENT_COUNT !== 0 ? true : false;
}

/* getting max IntentId from the tbl_intent
*/
async function getMaxIntentId() {
    const query = INTENT_QUERY.GET_MAX_INTENT_ID
        .replace('<tableName>', TABLES.INTENT);
    return 'INT' + ((await db.getRecord(query))
        .recordset[0].MAXINTENTID);
}

/*this function will check the max prospect_identifier_id and return the next prospect_identifier_id to be added
*/
function getNextIntentId(intentId) {
    return (intentId == 'INTnull') ? 'INT1'
        : 'INT' + (parseInt(intentId.substring(3)) + 1);
}

/*This function with return the Intent Data with the given prospectId and intentId from tbl_intent
*/
async function getIntentData(prospectId, intentId) {
    const query = INTENT_QUERY.GET_INTENT_BY_INTENTID
        .replace('<tableName>', TABLES.INTENT)
        .replace('<prospectId>', prospectId)
        .replace('<intentId>', intentId);
    console.log("\ngetIntentData query: \n" + query);

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
module.exports = { isIntentPresent, isIntentActive, getMaxIntentId, getNextIntentId, getIntentData, getActiveIntentData };
