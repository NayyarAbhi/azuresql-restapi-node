const db = require('../utils/azureSql.js');
const TABLES = require('../variables/tables.js').TABLES;
const HTTP = require('../variables/status.js').HTTP;
const validator = require('../validator/prospectValidator');
let PROSPECT_QUERY = require('../variables/prospect_sql.js').QUERY;
let X_Auth = require('../variables/x-authorisation.json');
let X_Auth_Find = require('../variables/x-auth-id-find.json');
let IDENTIFIER = require('../variables/identifier.js').IDENTIFIER;
const findById = require('../service/find-service.js');

/* checking if a Prospect present in the DB
*/
async function isProspectPresent(prospectId) {
    const query = PROSPECT_QUERY.RECORD_COUNT
        .replace('<tableName>', TABLES.PROSPECT)
        .replace('<prospectId>', prospectId);

    return (await db.getRecord(query))
        .recordset[0].RECORD_COUNT !== 0 ? true : false;
}

async function getProspectWithSessionIdorIBID(SessionId){
    const query = PROSPECT_QUERY.GET_PROSPECT_WITH_SESSION_ID
        .replace('<tableName>', TABLES.PROSPECT)
        .replace('<identifier>', SessionId);

    return (await db.getRecord(query))
        .recordset[0].PROSPECT_ID;
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

    if(getProspectWithSessionIdorIBID(X_Auth.sub) == 0 ){

        const newProspectId = parseInt(await getMaxProspectId()) + 1;
        const insertProspectQuery = PROSPECT_QUERY.INSERT_PROSPECT
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
        var insertProspectIdentifierQuery = PROSPECT_QUERY.INSERT_PROSPECT_IDENTIFIERS
            .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
            .replace('<prospectIdentifierId>', newProspectIdentifierId)
            .replace('<prospectId>', newProspectId)
            .replace('<activeFrom>', '')
            .replace('<activeTo>', '')
        if (X_Auth[0].userType == 'UNAUTH_CSTMR') {
            sessionIdorIBID = req.body.SessionId;
            insertProspectIdentifierQuery
                .replace('<identifierType>', 'SessionId')
                .replace('<identifier>', req.body.SessionId)
        }if (X_Auth[0].userType == 'UNAUTH_CSTMR') {
            sessionIdorIBID = req.body.IBID;
            insertProspectIdentifierQuery
                .replace('<identifierType>', 'IBID')
                .replace('<identifier>', req.body.IBID)
        }else{
            res.status(HTTP.NOT_FOUND.code)
                .json({ message: `User_Type is invalid.` });
        }
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
            .json({ message: `ProspectId: ${prospectId}` });
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ message: `ProspectId: ${prospectId}, does not exist in the system.` });
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

    const result = await findById.findProspect(req);
    console.log(result.error);

    if (result.error == null ) { 
        res.status(HTTP.OK.code)
            .json({ result: result });
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ result: result });
    }

    

    
    //TODO once the x-authenticaton-id api is ready we will get the json from that api, then chagne this logic  
    // if (jsonValue != null ) { //&& (X_Auth_Find[0].sub === req.body.IdentifierValue)
       
    //     res.status(HTTP.OK.code)
    //         .json({ Response: jsonValue });
    // } else {
    //     res.status(HTTP.NOT_FOUND.code)
    //         .json({ Response: `ProspectId: ${reqBody}, does not exist in the system.` });
    // }
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

    const result = await findById.findProspectById(req);
    console.log(result.error);

    if (result.error == null ) { 
        res.status(HTTP.OK.code)
            .json({ result: result });
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ result: result });
    }
}

// exporting modules, to be used in the other .js files
module.exports = { createProspect, addProspect, findProspectById, findProspect }
