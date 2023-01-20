let PROSPECT_INFO_QUERY = require('../../variables/queries.js').TBL_PROSPECT_INFORMATION_QUERY;
const TABLES = require('../../variables/tables.js').TABLES;
const db = require('../../utils/azureSql.js');


/* checking if a Intent is present in tbl_intent
*/
async function isProspectInfoPresent(prospectId) {
    const query = PROSPECT_INFO_QUERY.RECORD_COUNT
        .replace('<tableName>', TABLES.PROSPECT_INFORMATION)
        .replace('<prospectId>', prospectId);

    return (await db.getRecord(query))
        .recordset[0].RECORD_COUNT !== 0 ? true : false;
}

/* getting max PayloadId from the tbl_intent
*/
async function getMaxPayloadId() {
    const query = PROSPECT_INFO_QUERY.GET_MAX_PAYLOAD_ID
        .replace('<tableName>', TABLES.PROSPECT_INFORMATION);
    return 'PL' + ((await db.getRecord(query))
    .recordset[0].MAXPAYLOADID);
}

/*this function will check the max PayloadId and return the next PayloadId to be added
*/
function getNextPayloadId(payloadid) {
    return (payloadid == 'PLnull') ? 'PL1'
        : 'PL' + (parseInt(payloadid.substring(2)) + 1);
}


// exporting modules, to be used in the other .js files
module.exports = { isProspectInfoPresent, getMaxPayloadId, getNextPayloadId };
