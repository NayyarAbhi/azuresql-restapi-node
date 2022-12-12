const db = require('../utils/azureSql.js');
const TABLES = require('../variables/tables.js').TABLES;
const HTTP = require('../variables/status.js').HTTP;
const validator = require('../validator/prospectValidator');
let PROSPECT_QUERY = require('../variables/prospect_sql.js').QUERY;

// checking if a record present in the DB
async function isRecordPresent(prospectId) {
    const query = PROSPECT_QUERY.RECORD_COUNT
        .replace('<tableName>', TABLES.PROSPECT)
        .replace('<prospectId>', prospectId);

    return (await db.getRecord(query))
        .recordset[0].RECORD_COUNT !== 0 ? true : false;
}

async function isIdentifierPresent(prospectId, identifierType) {
    const query = PROSPECT_QUERY.COUNT
        .replace('<tableName>', TABLES.PROSPECT)
        .replace('<prospectId>', prospectId);

    return (await db.getRecord(query))
        .recordset[0].RECORD_COUNT !== 0 ? true : false;
}

async function addProspect(req, res) {
    console.log(req.params);
    console.log(req.body);
    // const combine = Object.assign({}, req.params, req.body);
    // const combine = {...req.params, ...req.body};
    // console.log(combine)
    if (error = validator.validateAddPayload({ ...req.params, ...req.body })) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    const prospectId = Number(req.params.ProspectId);
    const prospectIdentifierId = 5;
    const identifierType = req.body.IdentifierType;
    const identifierValue = req.body.IdentifierValue;
    const activeFrom = req.body.ActiveFrom;

    if (await isRecordPresent(prospectId)) {
        const insertQuery = PROSPECT_QUERY.INSERT
            .replace('<tableName>', TABLES.Prospect_Identifiers)
            .replace('<prospectIdentifierId>', prospectIdentifierId)
            .replace('<prospectId>', prospectId)
            .replace('<identifier>', identifierValue)
            .replace('<identifierType>', identifierType)
            .replace('<activeFrom>', activeFrom)
        console.log(insertQuery);
        const insertResult = await db.insertRecord(insertQuery);

        const updateQuery = PROSPECT_QUERY.UPDATE
            .replace('<tableName>', TABLES.Prospect_Identifiers)
            .replace('<prospectId>', prospectId);
        console.log(updateQuery);
        const updateResult = await db.updateRecord(updateQuery);

        res.status(HTTP.OK.code)
            .json({ message: `ProspectId: ${prospectId}` });
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ message: `ProspectId: ${prospectId}, does not exist in the system.` });
    }

}


// exporting modules, to be used in the other .js files
module.exports = { addProspect }
