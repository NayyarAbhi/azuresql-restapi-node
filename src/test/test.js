// Importing packages
const azureSql = require('../main/utils/azureSql.js');

// create schema in the db
async function createSchema(sql) {
    const result = await azureSql.dbOperation(sql);
    console.log(result);
}

// create table in the db
async function createTable(sql) {
    const result = await azureSql.dbOperation(sql);
    console.log(result);
    return
}

// insert record in the db
async function insertRecord(sql) {
    const result = await azureSql.dbOperation(sql);
    console.log(result);
}

// get record from the db
async function getRecord(sql) {
    const result = await azureSql.dbOperation(sql);
    console.log(result);
}

// update record in the db
async function updateRecord(sql) {
    const result = await azureSql.dbOperation(sql);
    console.log(result);
}

/* 
Sql Operation
*/
// let createSchemaSql = "CREATE SCHEMA TestSchema";
let createTableSql = "CREATE TABLE TestSchema.Intent (ProspectId varchar(255), FirstTimeBuyerFlag varchar(255), TimeEstimateForBuying varchar(255), FirstTimeBuyerSchemesFlag varchar(255), ResidenceOrBuytoLet varchar(255))";
let insertSql = "INSERT INTO TestSchema.Intent (ProspectId, FirstTimeBuyerFlag, TimeEstimateForBuying, FirstTimeBuyerSchemesFlag, ResidenceOrBuytoLet) VALUES (1, 'Y', '12months', 'Y', 'Residence'), (2, 'N', '09months', 'N', 'BuyToLet'), (3, 'Y', '06months', 'N', 'Residence')"
let readSql = "SELECT * FROM TestSchema.Intent WHERE ProspectId = 1";
// let updateSql = "UPDATE [SalesLT].[Customer] SET FirstName = 'ABHISHEK' WHERE CustomerID = 1"
let dropSql = "DROP TABLE TestSchema.Intent"

// createSchema(createSchemaSql)
// createTable(createTableSql)
// insertRecord(insertSql)
getRecord(readSql);
// updateRecord(updateSql);

