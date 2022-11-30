const azureSql = require('../utils/azureSql.js');
const TABLES = require('../variables/tables.js').TABLES;
const HTTP = require('../variables/status.js').HTTP;
let PROSPECT_QUERY = require('../variables/prospect_sql.js').QUERY;

// returning the record, if the prospect id exist in the system
async function getProspect(req, res) {
    id = req.query.id
    sqlQuery = PROSPECT_QUERY.SELECT
        .replace('<tableName>', TABLES.PROSPECT)
        .replace('<val>', id);

    const result = await azureSql.getRecord(sqlQuery);
    if (result.rowsAffected[0] !== 0) {
        res.status(HTTP.OK.code)
            .json(result.recordset)
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ message: `Prospect id: ${id}, does not exist in the system.` })
    }
}






// exporting modules, to be used in the other .js files
module.exports = { getProspect }