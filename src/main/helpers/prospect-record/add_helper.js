let PROSPECT_QUERY = require('../../variables/prospect_sql.js').QUERY;
const PROSPECT_IDENTIFIER_HELPER = require('./prospect_identifier_helper.js');
const TABLES = require('../../variables/tables.js').TABLES;
const db = require('../../utils/azureSql.js');
const PROSPECT_UPDATE_COLS = ['brand_identifier', 'channel_identifier', 'first_name']


function separateAddReqPayload(reqPayload) {
    let prospect_payload = [];
    let prospectIdentifier_payload = [];
    for (let value of Object.values(reqPayload)) {
        if (PROSPECT_UPDATE_COLS.includes(value.IdentifierType)) {
            prospect_payload.push(value);
        } else {
            prospectIdentifier_payload.push(value);
        }
    }
    return { prospect_payload, prospectIdentifier_payload };
}

/* updating Prospect details to the already existing Prospect
*/
async function updateProspectRecord(prospectId, reqPayload) {
    const updateQuery = PROSPECT_QUERY.UPDATE_PROSPECT
        .replace('<tableName>', TABLES.PROSPECT)
        .replace('<update_fields>', getUpdateFields(reqPayload))
        .replace('<prospectId>', prospectId);
    console.log("\nupdateQuery prospect: \n" + updateQuery);
    await db.updateRecord(updateQuery);
}

/* getting the list of IdentifierType which is required to be archived
return:
('SessionId','EmailId','MobileNumber', ....)
*/
function getIdentifierTypeList(reqPayload) {
    let updateFields = "'SessionId'";
    for (let value of Object.values(reqPayload)) {
        updateFields += (",'" + value.IdentifierType + "'");
    }
    return updateFields;
}

/* archiving the previous records by populating the ActiveTo column in Prospect_Identifiers table
*/
async function updateActiveTo(prospectId, reqPayload) {
    const updateQuery = PROSPECT_QUERY.UPDATE_ACTIVETO
        .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
        .replace('<prospectId>', prospectId)
        .replace('<identifierTypeList>', getIdentifierTypeList(reqPayload));
    console.log(updateQuery)
    await db.updateRecord(updateQuery);
}

/* getting list of values to be added in the Prospect_Identifiers table
return: 
('<prospectIdentifierId>',<prospectId>,'<identifier>','<identifierType>', '<activeFrom>')
*/
async function getInsertValues(prospectId, reqPayload) {
    let insert_Val_list = '';
    const lastItem = Object.values(reqPayload).pop();
    let max_prospectIdenId = await PROSPECT_IDENTIFIER_HELPER.getMaxProspectIdenId();

    for (let value of Object.values(reqPayload)) {
        let prospectIdenId = PROSPECT_IDENTIFIER_HELPER.getNextProspectIdenId(max_prospectIdenId);
        const insert_Val = PROSPECT_QUERY.INSERT_VALS
            .replace('<prospectIdentifierId>', prospectIdenId)
            .replace('<prospectId>', prospectId)
            .replace('<identifier>', value.IdentifierValue)
            .replace('<identifierType>', value.IdentifierType)
            .replace('<activeFrom>', value.ActiveFrom)

        insert_Val_list += insert_Val;
        insert_Val_list += (value !== lastItem) ? ',' : '';
        max_prospectIdenId = prospectIdenId;
    }
    return insert_Val_list;
}

/* adding Prospect Identifiers details to the already existing Prospect
*/
async function addProspectIdenRecord(prospectId, reqPayload) {
    const insertQuery = PROSPECT_QUERY.ADD_PROSP_IDENTIFIER
        .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
        .replace('<insertVals>', await getInsertValues(prospectId, reqPayload));
    console.log(insertQuery);
    await db.insertRecord(insertQuery);
}

/* getting list of columns and values to be updates in the Prospect_Identifiers table
return: 
<colName1>=<colValue1>,<colName2>=<colValue2>
*/
function getUpdateFields(payload) {
    let update_fields = '';
    const lastItem = Object.values(payload).pop();

    for (let value of Object.values(payload)) {
        update_fields += (value.IdentifierType + "='" + value.IdentifierValue + "'");
        update_fields += (value !== lastItem) ? ',' : '';
    }
    console.log("\nupdate_fields: \n" + update_fields);
    return update_fields;
}

// exporting modules, to be used in the other .js files
module.exports = { separateAddReqPayload, updateProspectRecord, updateActiveTo, addProspectIdenRecord };
