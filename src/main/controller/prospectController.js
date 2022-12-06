const db = require('../utils/azureSql.js');
const TABLES = require('../variables/tables.js').TABLES;
const HTTP = require('../variables/status.js').HTTP;
const validator = require('../validator/prospectValidator');
let PROSPECT_QUERY = require('../variables/prospect_sql.js').QUERY;

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
    if (error = validator.validateCreatePayload(req.body)) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    var customerId = req.body.customerId;
    if (await isRecordPresent(customerId)) {
        res.status(HTTP.NOT_FOUND.code)
            .json({ message: `Customer id: ${customerId}, already exist in the Records.` })
    } else {
        const newprospectid = parseInt(await getMaxProspectId()) + 1;
        const insertQuery = PROSPECT_QUERY.INSERT
            .replace('<tableName>', TABLES.PROSPECT)
            .replace('<prospectId>', newprospectid)
            .replace('<cookie>', req.body.Cookie)
            .replace('<sessionId>', req.body.SessionId)
            .replace('<otpEmailId>', req.body.OtpEmailId)
            .replace('<domusCookieId>', req.body.DomusCookieId)
            .replace('<iBLogon>', req.body.IBLogon)
            .replace('<customerId>', req.body.customerId);

        const result = await db.insertRecord(insertQuery);
        res.status(HTTP.OK.code)
            .json({ message: `Customer id ${customerId} is created successfully` })
    }
}

// updating the prospect, if the customerId exist in the system
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
