const supertest = require('supertest');
const app = require("../../../main/app.js");
const validator = require("../../../main/validator/intentValidator");
const PROSPECT_HELPER = require('../../../main/helpers/prospect/prospect_helper');
const UPDATE_HELPER = require('../../../main/helpers/intent/update_helper');
const INTENT_HELPER = require('../../../main/helpers/intent/intent_helper');
const PROSPECT_IDENTIFIER_HELPER = require('../../../main/helpers/prospect_record/prospect_identifier_helper');
const domusCookie = require('../../../main/helpers/domus/domusCookie');
const env = require('../../../main/config/envconfig').env;


const app_entry_point = env.APP_ENTRY_POINT + env.APP_VERSION;
const endpoint = `${app_entry_point}/10000000/intent/INT1`;
const update_intent_response = [200, "IntentId: INT1"];
const invalid_userType = { "id": 1, "userType": "UNAUTH_CUSTOMER1", "sub": "session121212", "exp": 1666343413 };
const valid_userType = { "id": 1, "userType": "UNAUTH_CUSTOMER", "sub": "session121212", "exp": 1666343413 };


describe("Update Intent", () => {

    describe("x-authorization-id not present in the request header", () => {
        it("Should return 400 along with error message", async () => {
            const { statusCode, res } = await supertest(app).put(endpoint).send();

            expect(statusCode).toBe(400);
            expect(res.text).toMatch(/\[{"message":"\\"x-authorization-id\\" is required".*/);
        })
    })

    describe("Request Payload is not valid", () => {
        it("Should return 400 along with error message", async () => {
            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const { statusCode, res } = await supertest(app).put(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(statusCode).toBe(400);
            expect(res.text).toMatch(/\[{"message":"\\"intent_questionaire_payload\\" is required".*/);
        })
    })

    describe("Invalid userType", () => {
        it("Should return 400 along with error message", async () => {
            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateUpdateSchema_mock = jest
                .spyOn(validator, 'validateUpdateSchema')
                .mockReturnValueOnce(false);

            const domusReponse_mock = jest
                .spyOn(domusCookie, 'getResponsePayload')
                .mockReturnValueOnce(invalid_userType);

            const { statusCode, res } = await supertest(app).put(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateUpdateSchema_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(statusCode).toBe(400);
            expect(res.text).toBe("{\"error\":\"Auth userType: UNAUTH_CUSTOMER1, is not valid.\"}");
        })
    })

    describe("Invalid ProspectId", () => {
        it("Should return 404 along with error message", async () => {
            const invalid_prospectId = null;

            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateUpdateSchema_mock = jest
                .spyOn(validator, 'validateUpdateSchema')
                .mockReturnValueOnce(false);

            const domusReponse_mock = jest
                .spyOn(domusCookie, 'getResponsePayload')
                .mockReturnValueOnce(valid_userType);

            const prospectId_mock = jest
                .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithSessionId')
                .mockReturnValueOnce(invalid_prospectId);

            const { statusCode, res } = await supertest(app).put(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateUpdateSchema_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(prospectId_mock).toHaveBeenCalled();
            expect(statusCode).toBe(404);
            expect(res.text).toBe("{\"error\":\"Prospect Record not found with userType and sub\"}");
        })
    })

    describe("ProspectId in API Request, not matching with prospectId in DB", () => {
        it("Should return 404 along with error message", async () => {
            const valid_prospectId = 10000001;

            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateUpdateSchema_mock = jest
                .spyOn(validator, 'validateUpdateSchema')
                .mockReturnValueOnce(false);

            const domusReponse_mock = jest
                .spyOn(domusCookie, 'getResponsePayload')
                .mockReturnValueOnce(valid_userType);

            const prospectId_mock = jest
                .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithSessionId')
                .mockReturnValueOnce(valid_prospectId);

            const { statusCode, res } = await supertest(app).put(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateUpdateSchema_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(prospectId_mock).toHaveBeenCalled();
            expect(statusCode).toBe(404);
            expect(res.text).toBe("{\"error\":\"ProspectId in the request is not associated with userType and sub\"}");
        })
    })

    describe("Prospect not present in the tbl_prospect table", () => {
        it("Should return 404 along with error message", async () => {
            const valid_prospectId = 10000000;

            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateUpdateSchema_mock = jest
                .spyOn(validator, 'validateUpdateSchema')
                .mockReturnValueOnce(false);

            const domusReponse_mock = jest
                .spyOn(domusCookie, 'getResponsePayload')
                .mockReturnValueOnce(valid_userType);

            const prospectId_mock = jest
                .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithSessionId')
                .mockReturnValueOnce(valid_prospectId);

            const tbl_prospect_mock = jest
                .spyOn(PROSPECT_HELPER, 'isProspectPresent')
                .mockReturnValueOnce(false);

            const { statusCode, res } = await supertest(app).put(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateUpdateSchema_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(prospectId_mock).toHaveBeenCalled();
            expect(tbl_prospect_mock).toHaveBeenCalled();
            expect(statusCode).toBe(404);
            expect(res.text).toBe("{\"error\":\"Prospect Record not found in Prospect table\"}");
        })
    })

    describe("Inactive Intent data present in the DB", () => {
        it("Should return 404 along with error message", async () => {
            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateUpdateSchema_mock = jest
                .spyOn(validator, 'validateUpdateSchema')
                .mockReturnValueOnce(false);

            const domusReponse_mock = jest
                .spyOn(domusCookie, 'getResponsePayload')
                .mockReturnValueOnce(valid_userType);

            const prospectId_mock = jest
                .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithSessionId')
                .mockReturnValueOnce(10000000);

            const tbl_prospect_mock = jest
                .spyOn(PROSPECT_HELPER, 'isProspectPresent')
                .mockReturnValueOnce(true);

            const isIntentActive_mock = jest
                .spyOn(INTENT_HELPER, 'isIntentActive')
                .mockReturnValueOnce(false);

            const { statusCode, res } = await supertest(app).put(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateUpdateSchema_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(prospectId_mock).toHaveBeenCalled();
            expect(tbl_prospect_mock).toHaveBeenCalled();
            expect(isIntentActive_mock).toHaveBeenCalled();
            expect(statusCode).toBe(404);
            expect(res.text).toBe("{\"error\":\"No Active Intent Record found with ProspectId and IntentId\"}");
        })
    })

    describe("Active Intent data present in the DB and Intent is updated", () => {
        it("Should return 200 along with response message", async () => {
            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateUpdateSchema_mock = jest
                .spyOn(validator, 'validateUpdateSchema')
                .mockReturnValueOnce(false);

            const domusReponse_mock = jest
                .spyOn(domusCookie, 'getResponsePayload')
                .mockReturnValueOnce(valid_userType);

            const update_intent_mock = jest
                .spyOn(UPDATE_HELPER, 'getResponse')
                .mockReturnValueOnce(update_intent_response);

            const { statusCode, res } = await supertest(app).put(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateUpdateSchema_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(update_intent_mock).toHaveBeenCalled();
            expect(statusCode).toBe(200);
            expect(res.text).toBe("IntentId: INT1");
        })
    })

    /* describe("Active Intent present in the DB and Intent is updated", () => {
         it("Should return 200 along with response payload", async () => {
             const valid_prospectId = 10000000;
 
             const validateXAuth_mock = jest
                 .spyOn(validator, 'validateXAuthHeader')
                 .mockReturnValueOnce(false);
 
             const validateUpdateSchema_mock = jest
                 .spyOn(validator, 'validateUpdateSchema')
                 .mockReturnValueOnce(false);
 
             const domusReponse_mock = jest
                 .spyOn(domusCookie, 'getResponsePayload')
                 .mockReturnValueOnce(valid_userType);
 
             const prospectId_mock = jest
                 .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithSessionId')
                 .mockReturnValueOnce(valid_prospectId);
 
             const tbl_prospect_mock = jest
                 .spyOn(PROSPECT_HELPER, 'isProspectPresent')
                 .mockReturnValueOnce(true);
 
             const isIntentActive_mock = jest
                 .spyOn(INTENT_HELPER, 'isIntentActive')
                 .mockReturnValueOnce(true);
 
             const update_intent_mock = jest
                 .spyOn(UPDATE_HELPER, 'updateIntent')
                 .mockReturnValueOnce(update_intent_response);
 
 
             const { statusCode, res } = await supertest(app).put(endpoint).send();
 
             expect(validateXAuth_mock).toHaveBeenCalled();
             expect(validateUpdateSchema_mock).toHaveBeenCalled();
             expect(domusReponse_mock).toHaveBeenCalled();
             expect(prospectId_mock).toHaveBeenCalled();
             expect(tbl_prospect_mock).toHaveBeenCalled();
             expect(isIntentActive_mock).toHaveBeenCalled();
             expect(update_intent_mock).toHaveBeenCalled();
             expect(statusCode).toBe(200);
             expect(res.text).toBe("IntentId: INT1");
         })
     }) */

})