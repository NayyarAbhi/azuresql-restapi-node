const ProspectService = require("../../../main/controller/prospectController");
const supertest = require('supertest');
var app = require("../../../main/app.js");
const CREATE_HELPER = require("../../../main/helpers/intent/create_helper");
PROSPECT_IDENTIFIER_HELPER = require("../../../main/helpers/prospect_record/prospect_identifier_helper")
const { intentRoutes } = require('../../../main/route/intent_route.js');
const X_Auth = require("../../../main/variables/x-authorisation.json");
const domusCookie = require('../../../main/helpers/domus/domusCookie');
PROSPECT_HELPER = require("../../../main/helpers/prospect/prospect_helper")
INTENT_HELPER = require("../../../main/helpers/intent/intent_helper")
const db = require('../../../main/utils/azureSql');



const X_Auth_dummy = [
    {
        "userType": "UNAUTH_CUSTOMER",
        "sub": "10000121",
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
    },
    {
        "userType": "UNAUTH_CUSTOMER",
        "sub": "10000008",
        "exp": 1666343413
    },
]


const dummyprospectId = 10000001;
const dummyprospectIdentifierId = 'PID1';
const dummy_response = [200, "message: ProspectId is created successfully"]
const xValidationdummyresponse = [200, "X_AUTH passes"]
const notFoundResponse = "{\"error\":\"ProspectId in the request is not associated with userType and sub\"}"
const doesNotExistResponse = "{\"error\":\"Prospect with userType and sub doesn't exist in the records\"}"
const dummy_response_prospect_exist = "{\"message\":\"ProspectId, already exist in the system.\"}"
const intentCreated = "{\"message\":\"IntentId INT5 is created successfully\"}"
const notValidUserType = "{\"error\":\"Auth userType is not valid.\"}"
const dummy_response_intent_exist = "{\"message\":\"Intent with ProspectId, already exist in the system.\"}"
const dummysub = "123232320";
const dummysub2 = "10000008";
const nulldummysub = null;


describe("Intent", () => {
    //create prospect
    describe("Create Intent", () => {
        //create prospect when usertype is ok

        describe("Given the Usertype is valid but X_auth is missing ", () => {

            it("Should return 400 and Intent not created", async () => {
                const { statusCode, res } = await supertest(app).post("/api/v1/prospect/10000008/intent/").send();
                expect(statusCode).toBe(400)

            })
        })


        describe("Given the Usertype is valid but X_auth is not missing", () => {

            it("Should return 200 and intent created", async () => {

                const getResponseServiceMock = jest
                    .spyOn(CREATE_HELPER, 'getResponse')
                    .mockReturnValueOnce(dummy_response);

                const getResponsePayloadMock = jest
                    .spyOn(domusCookie, 'getResponsePayload')
                    .mockReturnValueOnce(dummy_response);

                const xAauthValidationMock = jest
                    .spyOn(CREATE_HELPER, 'xAauthValidation')
                    .mockReturnValueOnce(xValidationdummyresponse);

                const { statusCode, res } = await supertest(app).post("/api/v1/prospect/10000008/intent/").send();
                console.log(statusCode)
                expect(statusCode).toBe(200)
                expect(res.text).toEqual(dummy_response[1])
                expect(getResponseServiceMock).toHaveBeenCalled();
                expect(xAauthValidationMock).toHaveBeenCalled();

            })

        })



        describe("Depending on Usertype but prospectid from db doesnot match with prospectid by sessionid", () => {

            if (X_Auth_dummy[0].userType == 'UNAUTH_CUSTOMER' && dummysub != 10000008) {
                it("Should return 404", async () => {

                    const xAauthValidationMock = jest
                        .spyOn(CREATE_HELPER, 'xAauthValidation')
                        .mockReturnValueOnce(xValidationdummyresponse);

                    const getResponsePayloadMock = jest
                        .spyOn(domusCookie, 'getResponsePayload')
                        .mockReturnValueOnce(X_Auth_dummy[0]);

                    const getProspectWithSessionIdMock = jest
                        .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithSessionId')
                        .mockReturnValueOnce(dummysub);

                    //Calling Create Intent function while taking prospectId = 10000008 as an example
                    const { statusCode, res } = await supertest(app).post("/api/v1/prospect/10000008/intent/").send();
                    expect(statusCode).toBe(404)
                    expect(res.text).toEqual(notFoundResponse)
                    expect(getProspectWithSessionIdMock).toHaveBeenCalled();
                    expect(xAauthValidationMock).toHaveBeenCalled();

                })
            }

            if (X_Auth_dummy[0].userType == 'UNAUTH_CUSTOMER' && dummysub2 == 10000008) {
                it("Should return ", async () => {

                    const xAauthValidationMock = jest
                        .spyOn(CREATE_HELPER, 'xAauthValidation')
                        .mockReturnValueOnce(xValidationdummyresponse);

                    const getResponsePayloadMock = jest
                        .spyOn(domusCookie, 'getResponsePayload')
                        .mockReturnValueOnce(X_Auth_dummy[0]);

                    const getProspectWithSessionIdMock = jest
                        .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithSessionId')
                        .mockReturnValueOnce(dummysub2);


                    const isProspectPresentMock = jest
                        .spyOn(PROSPECT_HELPER, 'isProspectPresent')
                        .mockReturnValueOnce(true);

                    const isIntentPresentMock = jest
                        .spyOn(INTENT_HELPER, 'isIntentPresent')
                        .mockReturnValueOnce(true);

                    //Calling Create Intent function while taking prospectId = 10000008 as an example
                    const { statusCode, res } = await supertest(app).post("/api/v1/prospect/10000008/intent/").send();
                    expect(statusCode).toBe(200)
                    expect(res.text).toEqual(dummy_response_intent_exist)
                    expect(getProspectWithSessionIdMock).toHaveBeenCalled();

                })

            }

            if (X_Auth_dummy[1].userType == 'IB_CUSTOMER' && dummysub != 10000008) {
                it("Should return 404", async () => {

                    const xAauthValidationMock = jest
                        .spyOn(CREATE_HELPER, 'xAauthValidation')
                        .mockReturnValueOnce(xValidationdummyresponse);

                    const getResponsePayloadMock = jest
                        .spyOn(domusCookie, 'getResponsePayload')
                        .mockReturnValueOnce(X_Auth_dummy[1]);

                    const getProspectWithIBIDIdMock = jest
                        .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithIBID')
                        .mockReturnValueOnce(dummysub);

                    //Calling Create Intent function while taking prospectId = 10000008 as an example
                    const { statusCode, res } = await supertest(app).post("/api/v1/prospect/10000008/intent/").send();
                    expect(statusCode).toBe(404)
                    expect(res.text).toEqual(notFoundResponse)
                    expect(getProspectWithIBIDIdMock).toHaveBeenCalled();
                    expect(xAauthValidationMock).toHaveBeenCalled();

                })
            }

            if (X_Auth_dummy[1].userType == 'IB_CUSTOMER' && dummysub2 == 10000008) {
                it("Should return ", async () => {

                    const xAauthValidationMock = jest
                        .spyOn(CREATE_HELPER, 'xAauthValidation')
                        .mockReturnValueOnce(xValidationdummyresponse);

                    const getResponsePayloadMock = jest
                        .spyOn(domusCookie, 'getResponsePayload')
                        .mockReturnValueOnce(X_Auth_dummy[1]);

                    const getProspectWithIBIDIdMock = jest
                        .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithIBID')
                        .mockReturnValueOnce(dummysub2);

                    const isProspectPresentMock = jest
                        .spyOn(PROSPECT_HELPER, 'isProspectPresent')
                        .mockReturnValueOnce(true);

                    const isIntentPresentMock = jest
                        .spyOn(INTENT_HELPER, 'isIntentPresent')
                        .mockReturnValueOnce(true);

                    //Calling Create Intent function while taking prospectId = 10000008 as an example
                    const { statusCode, res } = await supertest(app).post("/api/v1/prospect/10000008/intent/").send();
                    expect(statusCode).toBe(200)
                    expect(res.text).toEqual(dummy_response_intent_exist)
                    expect(getProspectWithIBIDIdMock).toHaveBeenCalled();

                })

            }

            if (X_Auth_dummy[2].userType == 'Not_Unauth_or_IB') {

                it("Should return 404 and Invalid Usertype", async () => {

                    const xAauthValidationMock = jest
                        .spyOn(CREATE_HELPER, 'xAauthValidation')
                        .mockReturnValueOnce(xValidationdummyresponse);

                    const getResponsePayloadMock = jest
                        .spyOn(domusCookie, 'getResponsePayload')
                        .mockReturnValueOnce(X_Auth_dummy[2]);

                    const { statusCode, res } = await supertest(app).post("/api/v1/prospect/10000008/intent/").send();
                    expect(statusCode).toBe(400)
                    expect(res.text).toEqual(notValidUserType)
                    expect(xAauthValidationMock).toHaveBeenCalled();
                    expect(getResponsePayloadMock).toHaveBeenCalled();

                })
            }
        })

        //Testing based on the usertype
        describe("Testing Based on Usertype", () => {

            if (X_Auth_dummy[0].sub != 10000008) {
                //prospectidfromdb is not equal to the prospectid from sessionid
                it("Should return 404 as prospectids do not match", async () => {

                    const xAauthValidationMock = jest
                        .spyOn(CREATE_HELPER, 'xAauthValidation')
                        .mockReturnValueOnce(xValidationdummyresponse);

                    const getResponsePayloadMock = jest
                        .spyOn(domusCookie, 'getResponsePayload')
                        .mockReturnValueOnce(X_Auth_dummy[0]);

                    const getProspectWithSessionIdMock = jest
                        .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithSessionId')
                        .mockReturnValueOnce(X_Auth_dummy[0].sub);

                    const { statusCode, res } = await supertest(app).post("/api/v1/prospect/10000008/intent/").send();
                    expect(statusCode).toBe(404)
                    expect(res.text).toEqual(notFoundResponse)
                    expect(getProspectWithSessionIdMock).toHaveBeenCalled();
                    expect(xAauthValidationMock).toHaveBeenCalled();
                    expect(getResponsePayloadMock).toHaveBeenCalled();

                })
            }

            //prospect with sub doesn't exist in the records
            it("Should return 404", async () => {

                const xAauthValidationMock = jest
                    .spyOn(CREATE_HELPER, 'xAauthValidation')
                    .mockReturnValueOnce(xValidationdummyresponse);

                const getResponsePayloadMock = jest
                    .spyOn(domusCookie, 'getResponsePayload')
                    .mockReturnValueOnce(X_Auth_dummy[0]);

                const getProspectWithSessionIdMock = jest
                    .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithSessionId')
                    .mockReturnValueOnce(null);

                const { statusCode, res } = await supertest(app).post("/api/v1/prospect/10000008/intent/").send();
                expect(statusCode).toBe(404)
                expect(res.text).toEqual(doesNotExistResponse)
                expect(xAauthValidationMock).toHaveBeenCalled();
                expect(getResponsePayloadMock).toHaveBeenCalled();

            })

            it("Should return 404", async () => {

                const xAauthValidationMock = jest
                    .spyOn(CREATE_HELPER, 'xAauthValidation')
                    .mockReturnValueOnce(xValidationdummyresponse);

                const getResponsePayloadMock = jest
                    .spyOn(domusCookie, 'getResponsePayload')
                    .mockReturnValueOnce(X_Auth_dummy[1]);

                const getProspectWithIBIDIdMock = jest
                    .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithIBID')
                    .mockReturnValueOnce(null);

                const { statusCode, res } = await supertest(app).post("/api/v1/prospect/10000008/intent/").send();
                expect(statusCode).toBe(404)
                expect(res.text).toEqual(doesNotExistResponse)
                expect(xAauthValidationMock).toHaveBeenCalled();
                expect(getResponsePayloadMock).toHaveBeenCalled();

            })

            if (X_Auth_dummy[3].userType == 'UNAUTH_CUSTOMER') {

                it("Should return 400", async () => {

                    const xAauthValidationMock = jest
                        .spyOn(CREATE_HELPER, 'xAauthValidation')
                        .mockReturnValueOnce(xValidationdummyresponse);

                    const getResponsePayloadMock = jest
                        .spyOn(domusCookie, 'getResponsePayload')
                        .mockReturnValueOnce(X_Auth_dummy[3]);

                    const getProspectWithSessionIdMock = jest
                        .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithSessionId')
                        .mockReturnValueOnce(X_Auth_dummy[3].sub);

                    const getMaxIntentIdMock = jest
                        .spyOn(INTENT_HELPER, 'getMaxIntentId')
                        .mockReturnValueOnce('INT4');

                    const insertRecordMock = jest
                        .spyOn(db, 'insertRecord')
                        .mockReturnValueOnce()

                    const isProspectPresentMock = jest
                        .spyOn(PROSPECT_HELPER, 'isProspectPresent')
                        .mockReturnValueOnce(true);

                    const isIntentPresentMock = jest
                        .spyOn(INTENT_HELPER, 'isIntentPresent')
                        .mockReturnValueOnce(false);

                    const getProspectWithIBIDIdMock = jest
                        .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithIBID')
                        .mockReturnValueOnce(dummysub);

                    const { statusCode, res } = await supertest(app).post("/api/v1/prospect/10000008/intent/").send();
                    expect(statusCode).toBe(200);
                    expect(res.text).toEqual(intentCreated)

                })

            }
        })
    })
})