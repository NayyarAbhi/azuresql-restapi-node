const db = require('../utils/azureSql.js');
const TABLES = require('../variables/tables.js').TABLES;
const HTTP = require('../variables/status.js').HTTP;
let PROSPECT_QUERY = require('../variables/prospect_sql.js').QUERY;

// checking if a record present in the DB
async function isRecordPresent(customerId) {
    const query = PROSPECT_QUERY.COUNT
        .replace('<tableName>', TABLES.PROSPECT)
        .replace('<customerId>', customerId);

    return (await db.getRecord(query))
        .recordset[0].RECORD_COUNT !== 0 ? true : false;
}

// returning the prospect, if the prospect id exist in the system
async function getProspect(req, res) {
    const customerId = req.query.customerId;

    if (await isRecordPresent(customerId)) {
        const getQuery = PROSPECT_QUERY.SELECT
            .replace('<tableName>', TABLES.PROSPECT)
            .replace('<customerId>', customerId);

        const result = await db.getRecord(getQuery);
        res.status(HTTP.OK.code)
            .json(result.recordset)
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ message: `Customer id: ${customerId}, does not exist in the system.` })
    }
}

// updating the prospect, if the customerId exist in the system
async function updateProspect(req, res) {
    const customerId = req.body.CustomerId;

    if (await isRecordPresent(customerId)) {
        const updateQuery = PROSPECT_QUERY.UPDATE
            .replace('<tableName>', TABLES.PROSPECT)
            .replace('<cookie>', req.body.Cookie)
            .replace('<sessionId>', req.body.SessionId)
            .replace('<otpEmailId>', req.body.OtpEmailId)
            .replace('<domusCookieId>', req.body.DomusCookieId)
            .replace('<iBLogon>', req.body.IBLogon)
            .replace('<customerId>', customerId);

        const result = await db.updateRecord(updateQuery);
        res.status(HTTP.OK.code)
            .json({ message: `Customer id ${customerId} is updated successfully` })
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ message: `Customer id: ${customerId}, does not exist in the system.` })
    }
}


// exporting modules, to be used in the other .js files
module.exports = { getProspect, updateProspect }