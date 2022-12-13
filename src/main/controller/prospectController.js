const db = require('../utils/azureSql.js');
const TABLES = require('../variables/tables.js').TABLES;
const HTTP = require('../variables/status.js').HTTP;
const validator = require('../validator/prospectValidator');
let PROSPECT_QUERY = require('../variables/prospect_sql.js').QUERY;
let IDENTIFIER = require('../variables/identifier.js').IDENTIFIER;

/* checking if a Prospect present in the DB
*/
async function isProspectPresent(prospectId) {
    const query = PROSPECT_QUERY.RECORD_COUNT
        .replace('<tableName>', TABLES.PROSPECT)
        .replace('<prospectId>', prospectId);

    return (await db.getRecord(query))
        .recordset[0].RECORD_COUNT !== 0 ? true : false;
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
function getInsertValues(prospectId, reqPayload) {
    let insert_Val_list = '';
    const lastItem = Object.values(reqPayload).pop();
    for (let value of Object.values(reqPayload)) {
        let insert_Val = PROSPECT_QUERY.INSERT_VALS
            .replace('<prospectIdentifierId>', 'PID2')
            .replace('<prospectId>', prospectId)
            .replace('<identifier>', value.IdentifierValue)
            .replace('<identifierType>', value.IdentifierType)
            .replace('<activeFrom>', value.ActiveFrom)

        insert_Val_list += insert_Val;
        insert_Val_list += (value !== lastItem) ? ',' : '';
    }
    return insert_Val_list;
}

/* adding Prospect details to the already existing Prospect
*/
async function addProspIdenRecord(prospectId, reqPayload) {
    const insertQuery = PROSPECT_QUERY.ADD_PROSP_IDENTIFIER
        .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
        .replace('<insertVals>', getInsertValues(prospectId, reqPayload))
    console.log(insertQuery);
    await db.insertRecord(insertQuery);
}

/* Add Prospect API to add Prospect details to the already existing Prospect
*/
async function addProspect(req, res) {
    const reqParams = req.params;
    const reqBody = req.body;

    if (error = (validator.validateProspectId(reqParams) || validator.validateAddPayload(reqBody))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    const prospectId = reqParams.ProspectId;
    if (await isProspectPresent(prospectId)) {
        await updateActiveTo(prospectId, reqBody);
        await addProspIdenRecord(prospectId, reqBody);
        res.status(HTTP.OK.code)
            .json({ message: `ProspectId: ${prospectId}` });
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ message: `ProspectId: ${prospectId}, does not exist in the system.` });
    }
}


// exporting modules, to be used in the other .js files
module.exports = { addProspect }
