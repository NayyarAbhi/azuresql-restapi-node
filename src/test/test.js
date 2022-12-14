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
// );


// INSERT INTO prospect.tbl_prospect_identifiers
// (prospect_id, created_on, brand_identifier, channel_identifier)
// VALUES
// (10000001, GETDATE(), 'Brand1', 'Channel1'),
// (10000002, GETDATE(), 'Brand2', 'Channel2');

// INSERT INTO prospect.tbl_prospect_identifiers
// (prospect_identifier_id, prospect_id, identifier, identifier_type, active_from)
// VALUES
// ('PID1', 10000001, 'SessionId1', 'SessionId', GETDATE()),
// ('PID2', 10000002, 'SessionId1', 'SessionId', GETDATE());


// SELECT *
// FROM TestSchema.Prospect;

// SELECT *
// FROM TestSchema.Prospect_Identifiers;


// ------ Identifier Type ------
// Session
// IBID
// Email
// MobileId



let obj = [
    {
        "IdentifierType": "EmailId",
        "IdentifierValue": "abc3@gmail.com",
        "ActiveFrom": "2022-12-07T15:52:35.023"
    },
    {
        "IdentifierType": "MobileNumber",
        "IdentifierValue": "7499999906",
        "ActiveFrom": "2022-12-07T15:56:35.023"
    },
    {
        "IdentifierType": "first_name",
        "IdentifierValue": "FirstName1",
        "ActiveFrom": "2022-12-07T15:56:35.023"
    },
    {
        "IdentifierType": "brand_identifier",
        "IdentifierValue": "Brand1",
        "ActiveFrom": "2022-12-07T15:56:35.023"
    }
]




// let IDENTIFIER_COUNT = "UPDATE <tableName> SET ActiveTo=GETDATE() WHERE ProspectId=<prospectId> and IdentifierType in (<identifierTypeList>) and ActiveTo is NULL";

// function getIdentifierTypeList(reqPayload) {
//     let fields = "'SessionId'";
//     for (let value of Object.values(reqPayload)) {
//         fields += (",'" + value.IdentifierType + "'");
//     }
//     return fields;
// }

// async function updateActiveTo(prospectId, reqPayload) {
//     const query = IDENTIFIER_COUNT
//         .replace('<tableName>', 'TestSchema.Prospect_Identifiers')
//         .replace('<prospectId>', prospectId)
//         .replace('<identifierTypeList>', getIdentifierTypeList(reqPayload));

//     console.log(query);

//     // return (await db.getRecord(query))
//     //     .recordset[0].RECORD_COUNT !== 0 ? true : false;
// }

// updateActiveTo('1001', obj)



// getList()
// console.log(obj)

// for (let [key, value] of Object.entries(obj)) {
//     console.log(key);
//     console.log(value);

// ('<prospectIdentifierId>',<prospectId>,'<identifier>','<identifierType>', CAST('<activeFrom>' as datetime))

// let INSERT_VALS = "('<prospectIdentifierId>',<prospectId>,'<identifier>','<identifierType>', CAST('<activeFrom>' as datetime))"

// function getInsertValues(prospectId, reqPayload) {
//     let insert_Val_list = '';
//     const lastItem = Object.values(obj).pop();
//     for (let value of Object.values(reqPayload)) {
//         let insert_Val = INSERT_VALS
//             .replace('<prospectIdentifierId>', 'PID2')
//             .replace('<prospectId>', prospectId)
//             .replace('<identifier>', value.IdentifierValue)
//             .replace('<identifierType>', value.IdentifierType)
//             .replace('<activeFrom>', value.ActiveFrom)

//         insert_Val_list += insert_Val;
//         insert_Val_list += (value !== lastItem) ? ',' : '';
//     }
//     return insert_Val_list;
// }

// console.log(getInsertValues('1001', obj));

const prospect_update_cols = ['brand_identifier', 'channel_identifier', 'first_name']
function separateAddReqPayload(reqPayload) {
    let prospect_payload = [];
    let prospectIdentifier_payload = [];
    for (let value of Object.values(reqPayload)) {
        if (prospect_update_cols.includes(value.IdentifierType)) {
            prospect_payload.push(value);
        } else {
            prospectIdentifier_payload.push(value);
        }
    }
    return { prospect_payload, prospectIdentifier_payload };
}

let { prospect_payload, prospectIdentifier_payload } = separateAddReqPayload(obj);

let reqPayload = [
    {
        IdentifierType: 'first_name',
        IdentifierValue: 'FirstName1',
        ActiveFrom: '2022-12-07T15:56:35.023'
    },
    {
        IdentifierType: 'brand_identifier',
        IdentifierValue: 'Brand1',
        ActiveFrom: '2022-12-07T15:56:35.023'
    }
]

// SET FirstTimeBuyerFlag='N', TimeEstimateForBuying='10months'
let UPDATE_PROSPECT = "UPDATE <tableName> SET <update_fields> WHERE prospect_id=<prospectId>";

function getUpdateFields(payload) {
    let update_fields = '';
    const lastItem = Object.values(payload).pop();

    for (let value of Object.values(payload)) {
        update_fields += (value.IdentifierType + "='" + value.IdentifierValue + "'");
        update_fields += (value !== lastItem) ? ',' : '';
    }
    return update_fields;
}

console.log(getUpdateFields(prospect_payload));
