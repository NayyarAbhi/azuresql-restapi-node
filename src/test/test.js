// Importing packages
const { Table } = require('mssql');
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
// let createTableSql = "CREATE TABLE TestSchema.Intent (ProspectId varchar(255), FirstTimeBuyerFlag varchar(255), TimeEstimateForBuying varchar(255), FirstTimeBuyerSchemesFlag varchar(255), ResidenceOrBuytoLet varchar(255))";
// let insertSql = "INSERT INTO TestSchema.Intent (ProspectId, FirstTimeBuyerFlag, TimeEstimateForBuying, FirstTimeBuyerSchemesFlag, ResidenceOrBuytoLet) VALUES (1, 'Y', '12months', 'Y', 'Residence'), (2, 'N', '09months', 'N', 'BuyToLet'), (3, 'Y', '06months', 'N', 'Residence')"
// let readSql = "SELECT * FROM TestSchema.Intent WHERE ProspectId = 1";
// let updateSql = "UPDATE [SalesLT].[Customer] SET FirstName = 'ABHISHEK' WHERE CustomerID = 1"
// let dropSql = "DROP TABLE TestSchema.Intent"
// let createTableSql = 'CREATE TABLE TestSchema.otprecord (id BIGINT PRIMARY KEY, first_name VARCHAR(255) NOT NULL, last_name  VARCHAR(255) DEFAULT NULL, email VARCHAR(255) NOT NULL, phone VARCHAR(255) NOT NULL, CONSTRAINT UQ_OTP_Email UNIQUE(email))'
// let createTableSql = "CREATE TABLE TestSchema.prospectdetails (ProspectId varchar(255), CustomerId varchar(255), Cookie varchar(255), SessionId varchar(255), OtpEmailId varchar(255), DomusCookieId varchar(255), IBLogon varchar(255))";
// let readSql = "SELECT * FROM TestSchema.prospectdetails WHERE CustomerId = 1";
// let insertSql = "INSERT INTO TestSchema.prospectdetails (ProspectId, CustomerId, Cookie, SessionId, OtpEmailId, DomusCookieId, IBLogon) VALUES ('101', '1', 'cookie1', 'sessionId1', 'abc1@gmail.com', 'DomusCookieId1', 'IBLogon1'), ('102', '2', 'cookie2', 'sessionId2', 'abc2@gmail.com', 'DomusCookieId2', 'IBLogon2'), ('103', '3', 'cookie3', 'sessionId3', 'abc3@gmail.com', 'DomusCookieId3', 'IBLogon3')"

// createSchema(createSchemaSql)
// createTable(createTableSql)
// insertRecord(insertSql)
// getRecord(readSql);
// updateRecord(updateSql);


// const payload = {
//     ProspectId: "2",
//     FirstTimeBuyerFlag: "N",
//     TimeEstimateForBuying: "09months",
//     FirstTimeBuyerSchemesFlag: "N",
//     ResidenceOrBuytoLet: "BuyToLet"
// }

// const updateSql = "UPDATE TestSchema.Intent SET FirstTimeBuyerFlag='N', TimeEstimateForBuying='10months', FirstTimeBuyerSchemesFlag='N', ResidenceOrBuytoLet='BuyToLet'  WHERE ProspectId=1";
// updateRecord(updateSql);


// {
// 	"CustomerId": "2",
// 	"Cookie": "cookie34",
// 	"SessionId": "sessionId2",
// 	"OtpEmailId": "abc2@gmail.com",
// 	"DomusCookieId": "DomusCookieId2",
// 	"IBLogon": "IBLogon2"
// }


// {
//     "message": "Customer id 2 is updated successfully"
// }



// http://localhost:9041/prospect
// {
// 	"CustomerId": "2",
// 	"Cookie": "cookie42",
// 	"SessionId": "sessionId2",
// 	"OtpEmailId": "abc2@gmail.com",
// 	"DomusCookieId": "DomusCookieId2",
// 	"IBLogon": "IBLogon2"
// }

// --------------------------------------------------------------API V2------------------------------------------------------------------------------

// Drop Table TestSchema.Prospect;
// CREATE TABLE TestSchema.Prospect (
//     ProspectId varchar(50),
//     CreatedOn datetime,
//     BrandIdentifier varchar(50),
//     ChannelIdentifier varchar(50),
// 	FirstName varchar(50)
// );

// Drop Table TestSchema.Prospect_Identifiers;
// CREATE TABLE TestSchema.Prospect_Identifiers (
//     ProspectIdentifierId integer,
//     ProspectId integer,
//     Identifier varchar(50),
//     IdentifierType varchar(50),
//     ActiveFrom datetime,
//     ActiveTo datetime
//     )

// Scenario 1 -- invalid userType

// {
//     "error": "Auth userType: IB_CUSTOMER, is not valid."
// }

// http://localhost:8000/prospect/v1/{10000000}

// [
//     {
//         "IdentifierType": "EmailId",
//         "IdentifierValue": "abc3@gmail.com",
//         "ActiveFrom": "2022-12-07T15:52:35.023"
//     }
// ]

// {
//     "userType": "IB_CUSTOMER",
//     "sub": "123232320",
//     "exp": 1666343413
// }

// Scenario 2 - invalid sessionid


// {
//     "error": "Prospect Record not found with userType:UNAUTH_CUSTOMER and sub: 123232321"
// }

// http://localhost:8000/prospect/v1/{10000000}

// {
//     "userType": "UNAUTH_CUSTOMER",
//     "sub": "123232321",
//     "exp": 1666343413
// }

// [
//     {
//         "IdentifierType": "EmailId",
//         "IdentifierValue": "abc3@gmail.com",
//         "ActiveFrom": "2022-12-07T15:52:35.023"
//     }
// ]


// Scenario 3 - invalid prospectid

// {
//     "error": "ProspectId: 10000001 in the request is not associated with userType:UNAUTH_CUSTOMER and sub: 123232320"
// }

// http://localhost:8000/prospect/v1/{10000001}

// {
//     "userType": "UNAUTH_CUSTOMER",
//     "sub": "123232320",
//     "exp": 1666343413
// }

// [
//     {
//         "IdentifierType": "EmailId",
//         "IdentifierValue": "abc3@gmail.com",
//         "ActiveFrom": "2022-12-07T15:52:35.023"
//     }
// ]

// Scenario 4 

// {
//     "ProspectId": 10000000
// }


// {
//     "userType": "UNAUTH_CUSTOMER",
//     "sub": "123232320",
//     "exp": 1666343413
// }

// [
//     {
//         "IdentifierType": "EmailId",
//         "IdentifierValue": "abc3@gmail.com",
//         "ActiveFrom": "2022-12-07T15:52:35.023"
//     }
// ]


// [
//     {
//         "IdentifierType": "EmailId",
//         "IdentifierValue": "abc30@gmail.com",
//         "ActiveFrom": "2022-12-07T15:52:35.023"
//     },
//     {
//         "IdentifierType": "MobileNumber",
//         "IdentifierValue": "7499990000",
//         "ActiveFrom": "2022-12-07T15:56:35.023"
//     },
//     {
//         "IdentifierType": "first_name",
//         "IdentifierValue": "FirstName2",
//         "ActiveFrom": "2022-12-07T15:56:35.023"
//     },
//     {
//         "IdentifierType": "brand_identifier",
//         "IdentifierValue": "Brand2",
//         "ActiveFrom": "2022-12-07T15:56:35.023"
//     }
// ]


/* ---------------------------------- INTENT -----------------------


INSERT INTO [prospect].[tbl_intent] 
(intent_id, prospect_id, intent_questionaire_payload, active_from, active_to)
VALUES 
('INT1', 10000000, '{newHome:"YES"}', GETDATE(), GETDATE()),
('INT2', 10000000, '{"newHome":"NO"}', GETDATE(), null);


*/