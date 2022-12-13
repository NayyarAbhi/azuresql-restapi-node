const db = require('../utils/azureSql.js');
const TABLES = require('../variables/tables.js').TABLES;
const HTTP = require('../variables/status.js').HTTP;
const validator = require('../validator/prospectValidator');
let PROSPECT_QUERY = require('../variables/prospect_sql.js').QUERY;
let X_Auth = require('../variables/x-authorisation.json');
let IDENTIFIER = require('../variables/identifier.js').IDENTIFIER;

/* checking if a Prospect present in the DB
*/
async function isProspectPresent(prospectId) {
    const query = PROSPECT_QUERY.RECORD_COUNT
        .replace('<tableName>', TABLES.PROSPECT)
        .replace('<customerId>', customerId);

    return (await db.getRecord(query))
        .recordset[0].RECORD_COUNT !== 0 ? true : false;
}

async function getMaxProspectId() {
    const query = PROSPECT_QUERY.GETPROSPECTID
        .replace('<tableName>', TABLES.PROSPECT);
    return (await db.getRecord(query))
        .recordset[0].MAX_PROSPECTID;
}

async function getMaxProspectIdentifierId() {
    const query = PROSPECT_QUERY.GETPROSPECTIDENTIFIERID
        .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS);
    return (await db.getRecord(query))
        .recordset[0].MAX_PROSPECTIDENTIFIERID;
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

// creating the prospect, if the customer id does not exist in the system
async function createProspect(req, res) {

    // if (error = validator.validateCreatePayload(req.body)) {
    //     return res.status(HTTP.BAD_REQUEST.code)
    //         .send(error.details);
    // }

    // var customerId = req.body.customerId;
    // if (await isRecordPresent(customerId)) {
    //     res.status(HTTP.NOT_FOUND.code)
    //         .json({ message: `Customer id: ${customerId}, already exist in the Records.` })
    // } else {
    //(prospectId,first_name,createOn,brandIdentifier,channelIdentifier)
    if (X_Auth.sub == req.body.SessionId || X_Auth == req.body.IBID) {

        const newProspectId = parseInt(await getMaxProspectId()) + 1;
        const insertProspectQuery = PROSPECT_QUERY.INSERTPROSPECT
            .replace('<tableName>', TABLES.PROSPECT)
            .replace('<prospectId>', newProspectId)
            .replace('<first_name>', req.body.first_name)
            .replace('<createdOn>', req.body.createdOn)
            .replace('<brandIdentifier>', req.body.brandIdentifier)
            .replace('<channelIdentifier>', req.body.channelIdentifier);

        const prospectInsertResult = await db.insertRecord(insertProspectQuery);

        var prevProspectIdentifierId = await getMaxProspectIdentifierId();
        const newProspectIdentifierId = 'PID' + (parseInt(prevProspectIdentifierId.substring(3)) + 1);
        var sessionIdorIBID;
        var insertProspectIdentifierQuery = PROSPECT_QUERY.INSERTPROSPECTIDENTIFIERS
            .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
            .replace('<prospectIdentifierId>', newProspectIdentifierId)
            .replace('<prospectId>', newProspectId)
            .replace('<activeFrom>', '')
            .replace('<activeTo>', '')
        if (req.body.SessionId != null) {
            sessionIdorIBID = req.body.SessionId;
            insertProspectIdentifierQuery
                .replace('<identifierType>', 'SessionId')
                .replace('<identifier>', req.body.SessionId)
        } else {
            sessionIdorIBID = req.body.IBID;
            insertProspectIdentifierQuery
                .replace('<identifierType>', 'IBID')
                .replace('<identifier>', req.body.IBID)

        }

        //prospectIdentifierId,prospectId,identifier,identifierType,activeFrom,activeTo
        const prospectIdentifierInsertResult = await db.insertRecord(insertProspectIdentifierQuery);

        res.status(HTTP.OK.code)
            .json({ message: `Prospectid ${newProspectId} is created successfully` })
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ message: `ProspectId: ${customerId}, already exist in the system.` });
    }
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
            .json({ message: `CustomerId ${customerId} is updated successfully` });
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ message: `CustomerId: ${customerId}, does not exist in the system.` });
    }
}


// exporting modules, to be used in the other .js files
module.exports = { createProspect, addProspect }
