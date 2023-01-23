const ProspectService = require("../../../main/controller/prospectController");
const supertest = require('supertest');
var app = require("../../../main/app.js");
const CREATE_HELPER = require("../../../main/helpers/prospect_record/create_helper");
PROSPECT_IDENTIFIER_HELPER = require("../../../main/helpers/prospect_record/prospect_identifier_helper")
const { intentRoutes } = require('../../../main/route/intent_route.js');
const PROSPECT_HELPER = require("../../../main/helpers/prospect/prospect_helper")
const domusCookie = require('../../../main/helpers/domus/domusCookie');
const db = require('../../../main/utils/azureSql');


const dummyprospectId = 10000001;
const dummyprospectIdentifierId = 'PID1';
const dummy_response = [200, "message: ProspectId is created successfully"]
const dummy_prospect_created_response = "{\"message\":\"ProspectId 10000002 is created successfully\"}"
const xValidationdummyresponse = [200, "X_AUTH passes"]
dummy_response_prospect_exist = "{\"message\":\"ProspectId, already exist in the system.\"}"
const dummysub = "123232320";
const nulldummysub = null;
const X_Auth_dummy = [
    {
        "userType": "UNAUTH_CUSTOMER",
        "sub": "123232320",
        "exp": 1666343413
    },
    {
        "userType": "IB_CUSTOMER",
        "sub": "123232330",
        "exp": 1666343413
    },
    {
        "userType": "Not_Unauth_or_IB",
        "sub": "123232330",
        "exp": 1666343413
    }
]


describe("Prospect", () => {
    //create prospect
    describe("Create Prospect", () => {
        //create prospect when usertype is ok

        describe("Given the Usertype is valid but X_auth is missing ", () => {

            it("Should return 400 and prospectId not created", async () => {

                const { statusCode, res } = await supertest(app).post("/api/v1/prospect/").send();
                expect(statusCode).toBe(400)

            })

        })


        describe("Given the Usertype is valid but X_auth is not missing", () => {

            it("Should return 200 and prospectId created", async () => {

                const getResponseServiceMock = jest
                    .spyOn(CREATE_HELPER, 'getResponse')
                    .mockReturnValueOnce(dummy_response);

                const getResponsePayloadMock = jest
                    .spyOn(domusCookie, 'getResponsePayload')
                    .mockReturnValueOnce(dummy_response);

                const xAauthValidationMock = jest
                    .spyOn(CREATE_HELPER, 'xAauthValidation')
                    .mockReturnValueOnce(xValidationdummyresponse);

                const { statusCode, res } = await supertest(app).post("/api/v1/prospect/").send();

                expect(statusCode).toBe(200)
                expect(res.text).toEqual(dummy_response[1])
                expect(getResponseServiceMock).toHaveBeenCalled();
                expect(xAauthValidationMock).toHaveBeenCalled();

            })

        })



        //testing create function as a whole
        describe("everything valid inside create method", () => {

            if (X_Auth_dummy[0].userType == 'UNAUTH_CUSTOMER') {
                it("should return 200", async () => {

                    const getProspectWithSessionIdMock = jest
                        .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithSessionId')
                        .mockReturnValueOnce(nulldummysub);

                    const getMaxProspectIdMock = jest
                        .spyOn(PROSPECT_HELPER, 'getMaxProspectId')
                        .mockReturnValueOnce(dummyprospectId);

                    const getResponsePayloadMock = jest
                        .spyOn(domusCookie, 'getResponsePayload')
                        .mockReturnValueOnce(X_Auth_dummy[0]);

                    const insertRecordMock = jest
                        .spyOn(db, 'insertRecord')
                        .mockReturnValueOnce().mockReturnValueOnce();

                    const getMaxProspectIdenIdMock = jest
                        .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getMaxProspectIdenId')
                        .mockReturnValueOnce(dummyprospectIdentifierId);

                    const xAauthValidationMock = jest
                        .spyOn(CREATE_HELPER, 'xAauthValidation')
                        .mockReturnValueOnce(xValidationdummyresponse);


                    const { statusCode, res } = await supertest(app).post("/api/v1/prospect/").send();
                    //console.log(statusCode, res)
                    expect(statusCode).toBe(200)
                    expect(res.text).toEqual(dummy_prospect_created_response)
                    expect(xAauthValidationMock).toHaveBeenCalled();
                    expect(getMaxProspectIdenIdMock).toHaveBeenCalled();
                    expect(insertRecordMock).toHaveBeenCalled();
                    expect(getMaxProspectIdMock).toHaveBeenCalled();
                    expect(getProspectWithSessionIdMock).toHaveBeenCalled();
                    expect(getResponsePayloadMock).toHaveBeenCalled();

                })
            }
            if (X_Auth_dummy[1].userType == 'IB_CUSTOMER') {
                it("should return 200", async () => {

                    const getProspectWithIBIdMock = jest
                        .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithIBID')
                        .mockReturnValueOnce(nulldummysub);

                    const getMaxProspectIdMock = jest
                        .spyOn(PROSPECT_HELPER, 'getMaxProspectId')
                        .mockReturnValueOnce(dummyprospectId);

                    const getResponsePayloadMock = jest
                        .spyOn(domusCookie, 'getResponsePayload')
                        .mockReturnValueOnce(X_Auth_dummy[1]);

                    const insertRecordMock = jest
                        .spyOn(db, 'insertRecord')
                        .mockReturnValueOnce().mockReturnValueOnce();

                    const getMaxProspectIdenIdMock = jest
                        .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getMaxProspectIdenId')
                        .mockReturnValueOnce(dummyprospectIdentifierId);

                    const xAauthValidationMock = jest
                        .spyOn(CREATE_HELPER, 'xAauthValidation')
                        .mockReturnValueOnce(xValidationdummyresponse);

                    const { statusCode, res } = await supertest(app).post("/api/v1/prospect/").send();

                    expect(statusCode).toBe(200)
                    expect(res.text).toEqual(dummy_prospect_created_response)
                    expect(getMaxProspectIdenIdMock).toHaveBeenCalled();
                    expect(xAauthValidationMock).toHaveBeenCalled();
                    expect(insertRecordMock).toHaveBeenCalled();
                    expect(getMaxProspectIdMock).toHaveBeenCalled();
                    expect(getProspectWithIBIdMock).toHaveBeenCalled();

                })


            } if (X_Auth_dummy[2].userType == 'Not_Unauth_or_IB') {

                it("Should return 400", async () => {

                    const xAauthValidationMock = jest
                        .spyOn(CREATE_HELPER, 'xAauthValidation')
                        .mockReturnValueOnce(xValidationdummyresponse);

                    const getResponsePayloadMock = jest
                        .spyOn(domusCookie, 'getResponsePayload')
                        .mockReturnValueOnce(X_Auth_dummy[2]);

                    const getProspectWithIBIDIdMock = jest
                        .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithIBID')
                        .mockReturnValueOnce(dummysub);

                    const { statusCode } = await supertest(app).post("/api/v1/prospect/").send();
                    expect(statusCode).toBe(400);

                })

            }

        })


        //Testing based on the usertype
        //prospect already exist
        describe("Testing Based on Usertype)", () => {

            if (X_Auth_dummy[0].userType == 'UNAUTH_CUSTOMER') {

                it("Should return 200", async () => {

                    const xAauthValidationMock = jest
                        .spyOn(CREATE_HELPER, 'xAauthValidation')
                        .mockReturnValueOnce(xValidationdummyresponse);

                    const getResponsePayloadMock = jest
                        .spyOn(domusCookie, 'getResponsePayload')
                        .mockReturnValueOnce(X_Auth_dummy[0]);

                    const getProspectWithSessionIdMock = jest
                        .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithSessionId')
                        .mockReturnValueOnce(dummysub);

                    const { statusCode, res } = await supertest(app).post("/api/v1/prospect/").send();
                    expect(res.text).toEqual(dummy_response_prospect_exist)
                    expect(getProspectWithSessionIdMock).toHaveBeenCalled();

                })
            }
            if (X_Auth_dummy[1].userType == 'IB_CUSTOMER') {

                it("Should return 200", async () => {

                    const xAauthValidationMock = jest
                        .spyOn(CREATE_HELPER, 'xAauthValidation')
                        .mockReturnValueOnce(xValidationdummyresponse);

                    const getProspectWithIBIDIdMock = jest
                        .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithIBID')
                        .mockReturnValueOnce(dummysub);

                    const getResponsePayloadMock = jest
                        .spyOn(domusCookie, 'getResponsePayload')
                        .mockReturnValueOnce(X_Auth_dummy[1]);

                    const { statusCode, res } = await supertest(app).post("/api/v1/prospect/").send();
                    expect(statusCode).toBe(200)
                    expect(res.text).toEqual(dummy_response_prospect_exist)
                    expect(getProspectWithIBIDIdMock).toHaveBeenCalled();

                })

            } if (X_Auth_dummy[2].userType == 'Not_Unauth_or_IB') {

                it("Should return 400", async () => {

                    const xAauthValidationMock = jest
                        .spyOn(CREATE_HELPER, 'xAauthValidation')
                        .mockReturnValueOnce(xValidationdummyresponse);

                    const getResponsePayloadMock = jest
                        .spyOn(domusCookie, 'getResponsePayload')
                        .mockReturnValueOnce(X_Auth_dummy[2]);

                    const getProspectWithIBIDIdMock = jest
                        .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithIBID')
                        .mockReturnValueOnce(dummysub);

                    const { statusCode } = await supertest(app).post("/api/v1/prospect/").send();
                    expect(statusCode).toBe(400);

                })

            }
        })
    })
})




// // Importing packages
// const { Table } = require('mssql');
// const azureSql = require('../../main/utils/azureSql.js');

// // create schema in the db
// async function createSchema(sql) {
//     const result = await azureSql.dbOperation(sql);
//     console.log(result);
// }

// // create table in the db
// async function createTable(sql) {
//     const result = await azureSql.dbOperation(sql);
//     console.log(result);
//     return
// }

// // insert record in the db
// async function insertRecord(sql) {
//     const result = await azureSql.dbOperation(sql);
//     console.log(result);
// }

// // get record from the db
// async function getRecord(sql) {
//     const result = await azureSql.dbOperation(sql);
//     console.log(result);
// }

// // update record in the db
// async function updateRecord(sql) {
//     const result = await azureSql.dbOperation(sql);
//     console.log(result);
// }

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

-- DEMO
delete from [prospect].[tbl_intent];
delete from [prospect].[tbl_prospect_identifiers];
delete from [prospect].[tbl_prospect];

select * from [prospect].[tbl_prospect];

select * from [prospect].[tbl_prospect_identifiers];

select * from [prospect].[tbl_intent];



UPDATE [prospect].[tbl_intent] SET active_to = GETDATE() where intent_id in ('INT2')

INSERT INTO [prospect].[tbl_intent] 
(intent_id, prospect_id, intent_questionaire_payload, active_from, active_to)
VALUES 
('INT3', 10000001, 
'{"CustomerIntention":"Customer_Intention1","FirstProperty":"FirstProperty1","BuyingReadiness":"BuyingReadiness1","NoOfApplicants":"NoOfApplicants1","Occupying":"Occupying1","LbgMortgaged":"LbgMortgaged1","RemoReadiness":"RemoReadiness1"}'
, GETDATE(), null)


*/