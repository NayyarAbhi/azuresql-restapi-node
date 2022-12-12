const db = require('../utils/azureSql.js');
const TABLES = require('../variables/tables.js').TABLES;
const HTTP = require('../variables/status.js').HTTP;
const validator = require('../validator/prospectValidator');
let PROSPECT_QUERY = require('../variables/prospect_sql.js').QUERY;
let X_Auth = require('../variables/x-authorisation.json');
const PRIMARY_KEYS = ['CustomerId'];

// checking if a record present in the DB
async function isRecordPresent(customerId) {
    const query = PROSPECT_QUERY.COUNT
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

async function getMaxProspectIdentifierId(){
    const query = PROSPECT_QUERY.GETPROSPECTIDENTIFIERID
        .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS);
    return (await db.getRecord(query))
        .recordset[0].MAX_PROSPECTIDENTIFIERID;
}

// getting fields from payload, which needs to be updated
function getUpdateFields(obj) {
    for (let key of PRIMARY_KEYS) delete obj[key];

    let update_fields = '';
    const lastItem = Object.values(obj).pop();
    for (let [key, value] of Object.entries(obj)) {
        update_fields += (key + "='" + value + "'");
        update_fields += (value !== lastItem) ? ',' : '';
    }
    return update_fields;
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
    if (X_Auth.sub==req.body.SessionId || X_Auth==req.body.IBID) {

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
            .replace('<activeTo>','')
            if(req.body.SessionId!=null){
                sessionIdorIBID=req.body.SessionId;
                insertProspectIdentifierQuery
                    .replace('<identifierType>','SessionId')
                    .replace('<identifier>',req.body.SessionId)
            }else{
                sessionIdorIBID=req.body.IBID;
                insertProspectIdentifierQuery
                    .replace('<identifierType>','IBID')
                    .replace('<identifier>',req.body.IBID)

            }

            //prospectIdentifierId,prospectId,identifier,identifierType,activeFrom,activeTo
        const prospectIdentifierInsertResult = await db.insertRecord(insertProspectIdentifierQuery);
        
        res.status(HTTP.OK.code)
            .json({ message: `Prospectid ${newProspectId} is created successfully` })
    }else{
        res.status(HTTP.NOT_FOUND.code)
            .json({ message: `ProspectId: ${customerId}, already exist in the system.` });
    }
}

//identifiertype -  SessionId,EmailId,MobileNumber,IBID
//v1
//max k lie dono main krna prospectid--8 digit prospectidentifierid - PID1
//validate api mock likhna hai
//only sessionid or IBID in createprospect

// updating the prospect, if the IBID exist in the system
async function updateProspect(req, res) {
    if (error = validator.validateUpdatePayload(req.body)) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    const customerId = req.body.CustomerId;
    if (await isRecordPresent(customerId)) {
        const updateQuery = PROSPECT_QUERY.UPDATE
            .replace('<tableName>', TABLES.PROSPECT)
            .replace('<update_fields>', getUpdateFields(req.body))
            .replace('<customerId>', customerId);

        const result = await db.updateRecord(updateQuery);
        res.status(HTTP.OK.code)
            .json({ message: `CustomerId ${customerId} is updated successfully` });
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ message: `CustomerId: ${customerId}, does not exist in the system.` });
    }
}


// exporting modules, to be used in the other .js files
module.exports = { updateProspect, createProspect }
