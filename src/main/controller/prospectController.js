const azureSql = require('../utils/azureSql.js');
let prospect_sql = require('../variables/prospect_sql.js');
const table = require('../variables/tables.js');
const status = require('../variables/status.js');


// returning the record, if the prospect id exist in the system
async function getProspect(req, res) {
    id = req.query.id
    sqlQuery = prospect_sql.QUERY.SELECT
        .replace('<tableName>', table.TABLES.PROSPECT)
        .replace('<val>', id);

    const result = await azureSql.getRecord(sqlQuery);
    if (result.rowsAffected[0] === 1) {
        res.status(status.HTTP.OK.code)
            .json(result.recordset)
    } else {
        res.status(status.HTTP.NOT_FOUND.code)
            .json({ message: `Prospect id: ${id}, does not exist in the system` })
    }
}




// exporting modules, to be used in the other .js files
module.exports = { getProspect }