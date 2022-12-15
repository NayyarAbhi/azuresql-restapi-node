const db = require('../utils/azureSql.js');
const TABLES = require('../variables/tables.js').TABLES;
const HTTP = require('../variables/status.js').HTTP;
const validator = require('../validator/prospectValidator');
let PROSPECT_QUERY = require('../variables/prospect_sql.js').QUERY;
const prospectIden_Service = require('../helper/prospect-record/prospect-identifier-service.js');
let X_Auth = require('../variables/x-authorisation.json');
let X_Auth_Find = require('../variables/x-auth-id-find.json');
const X_Auth_Add = require('../variables/x-auth-add.json');
let IDENTIFIER = require('../variables/identifier.js').IDENTIFIER;
const findBy = require('../helper/prospect-record/find-service.js')
const PROSPECT_UPDATE_COLS = ['brand_identifier', 'channel_identifier', 'first_name']

/* checking if a Prospect present in the DB
*/
async function isProspectPresent(prospectId) {
    const query = PROSPECT_QUERY.RECORD_COUNT
        .replace('<tableName>', TABLES.PROSPECT)
        .replace('<prospectId>', prospectId);

    return (await db.getRecord(query))
        .recordset[0].RECORD_COUNT !== 0 ? true : false;
}

async function getProspectWithSessionIdorIBID(SessionIdorIBID) {
    const query = PROSPECT_QUERY.GET_PROSPECT_WITH_SESSION_ID_OR_IBID
        .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
        .replace('<identifier>', SessionIdorIBID);
    var record = (await db.getRecord(query)).recordset[0]
    if (record != null) {
        return record.PROSPECT_ID;
    } else {
        return null;
    }
}

async function getMaxProspectId() {
    const query = PROSPECT_QUERY.GET_PROSPECT_ID
        .replace('<tableName>', TABLES.PROSPECT);
    return (await db.getRecord(query))
        .recordset[0].MAXPROSPECTID;
}

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

/* getting list of values to be added in the Prospect_Identifiers table
return: 
('<prospectIdentifierId>',<prospectId>,'<identifier>','<identifierType>', '<activeFrom>')
*/
async function getInsertValues(prospectId, reqPayload) {
    let insert_Val_list = '';
    const lastItem = Object.values(reqPayload).pop();
    let max_prospectIdenId = await getMaxProspectIdenId();

    for (let value of Object.values(reqPayload)) {
        let prospectIdenId = getNextProspectIdenId(max_prospectIdenId);
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

/* adding Prospect Identifiers details to the already existing Prospect
*/
async function addProspectIdenRecord(prospectId, reqPayload) {
    const insertQuery = PROSPECT_QUERY.ADD_PROSP_IDENTIFIER
        .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
        .replace('<insertVals>', await getInsertValues(prospectId, reqPayload));
    console.log(insertQuery);
    await db.insertRecord(insertQuery);
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

// creating the prospect, if the customer id does not exist in the system
async function createProspect(req, res) {

    if (error = validator.validateCreatePayload(req.body)) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    var ProspectIdfromDB
    var usertype = X_Auth[0].userType
    if (usertype === 'UNAUTH_CUSTOMER') {
        ProspectIdfromDB = await prospectIden_Service.getProspectWithSessionId(X_Auth[0].sub)
    } else if (usertype === 'IB_CUSTOMER') {
        ProspectIdfromDB = await prospectIden_Service.getProspectWithIBID(X_Auth[0].sub)
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ message: `User_Type is invalid.` });
        return
    }
    if (ProspectIdfromDB == null) {
        var prevProspectId = await getMaxProspectId();
        var newProspectId = prevProspectId == null ? 10000000 : (parseInt(prevProspectId) + 1);
        const insertProspectQuery = PROSPECT_QUERY.INSERT_PROSPECT
            .replace('<tableName>', TABLES.PROSPECT)
            .replace('<prospect_id>', newProspectId)
            .replace('<first_name>', req.body.first_name == undefined ? '' : req.body.first_name)
            .replace('<created_on>', req.body.created_on)
            .replace('<brand_identifier>', req.body.brand_identifier)
            .replace('<channel_identifier>', req.body.channel_identifier == undefined ? '' : req.body.channel_identifier);

        const prospectInsertResult = await db.insertRecord(insertProspectQuery);

        var prevProspectIdentifierId = await getMaxProspectIdenId();
        var newProspectIdentifierId = getNextProspectIdenId(prevProspectIdentifierId)

        var usertype = X_Auth[0].userType
        if (usertype === 'UNAUTH_CUSTOMER') {
            var insertProspectIdentifierQuery = PROSPECT_QUERY.INSERT_PROSPECT_IDENTIFIERS
                .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
                .replace('<prospect_identifier_id>', newProspectIdentifierId)
                .replace('<prospect_id>', newProspectId)
                .replace('<identifier_type>', 'SessionId')
                .replace('<identifier>', X_Auth[0].sub)

        } else {
            var insertProspectIdentifierQuery = PROSPECT_QUERY.INSERT_PROSPECT_IDENTIFIERS
                .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
                .replace('<prospect_identifier_id>', newProspectIdentifierId)
                .replace('<prospect_id>', newProspectId)
                .replace('<identifier_type>', 'IBID')
                .replace('<identifier>', X_Auth[0].sub)
        }

        const prospectIdentifierInsertResult = await db.insertRecord(insertProspectIdentifierQuery);

        res.status(HTTP.OK.code)
            .json({ message: `ProspectId ${newProspectId} is created successfully` })

    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ message: `ProspectId: ${ProspectIdfromDB}, already exist in the system.` });
    }
}

/* Add Prospect API to add Prospect contact details by ProspectId to the already existing Prospect
*/
async function addProspectById(req, res) {
    const reqParams = req.params;
    const reqPayload = req.body;

    if (error = (validator.validateProspectId(reqParams) || validator.validateAddPayload(reqPayload))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    if (X_Auth_Add.userType === "UNAUTH_CUSTOMER") {
        const dbProspectId = await prospectIden_Service.getProspectWithSessionId(X_Auth_Add.sub);

        if (dbProspectId == null || dbProspectId != reqParams.ProspectId) {
            res.status(HTTP.NOT_FOUND.code)
                .json({ error: `ProspectId: ${dbProspectId}, is not associated with Auth SessionId: ${X_Auth_Add.sub}` });
        } else {
            let { prospect_payload, prospectIdentifier_payload } = separateAddReqPayload(reqPayload);
            await updateActiveTo(dbProspectId, prospectIdentifier_payload);
            await addProspectIdenRecord(dbProspectId, prospectIdentifier_payload);
            await updateProspectRecord(dbProspectId, prospect_payload);

            res.status(HTTP.OK.code)
                .json({ ProspectId: dbProspectId });
        }
    } else {
        res.status(HTTP.BAD_REQUEST.code)
            .json({ error: `Auth userType: ${X_Auth_Add.userType}, is not valid.` });
    }
}

/* Add Prospect API to add Prospect contact details to the already existing Prospect
*/
async function addProspect(req, res) {
    const reqPayload = req.body;

    if (error = validator.validateAddPayload(reqPayload)) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    if (X_Auth_Add.userType === "UNAUTH_CUSTOMER") {
        const dbProspectId = await prospectIden_Service.getProspectWithSessionId(X_Auth_Add.sub);

        if (dbProspectId == null) {
            res.status(HTTP.NOT_FOUND.code)
                .json({ error: `ProspectId: ${dbProspectId}, is not associated with Auth SessionId: ${X_Auth_Add.sub}` });
        } else {
            let { prospect_payload, prospectIdentifier_payload } = separateAddReqPayload(reqPayload);
            await updateActiveTo(dbProspectId, prospectIdentifier_payload);
            await addProspectIdenRecord(dbProspectId, prospectIdentifier_payload);
            await updateProspectRecord(dbProspectId, prospect_payload);

            res.status(HTTP.OK.code)
                .json({ ProspectId: dbProspectId });
        }
    } else {
        res.status(HTTP.BAD_REQUEST.code)
            .json({ error: `Auth userType: ${X_Auth_Add.userType}, is not valid.` });
    }
}

/* Find Prospect API to retrieve Prospect details
*/
async function findProspect(req, res) {

    const reqBody = req.body;
    var X_Auth_ID = req.headers['x-authrization-id'];
    console.log(X_Auth_ID)
    //validate request body and x-authrization-id are not empty
    if (error = (validator.validateXAuthHeader(X_Auth_ID) && validator.validateFindPayload(reqBody))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    const result = await findBy.findProspect(req);
    console.log(result.error);

    if (result.error == null) {
        res.status(HTTP.OK.code)
            .json({ result: result });
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ result: result });
    }
}

/* Find Prospect API to retrieve Prospect details
*/
async function findProspectById(req, res) {
    const reqParams = req.params;
    const prospectId = reqParams.ProspectId;
    var X_Auth_ID = req.headers['x-authrization-id'];
    //validate the request data and headers
    if (error = (validator.validateXAuthHeader(X_Auth_ID) && validator.validateProspectId(reqParams))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    const result = await findBy.findProspectById(req);
    console.log(result.error);

    if (result.error == null) {
        res.status(HTTP.OK.code)
            .json({ result: result });
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ result: result });
    }

}
// exporting modules, to be used in the other .js files
module.exports = { createProspect, addProspectById, addProspect, findProspectById, findProspect }