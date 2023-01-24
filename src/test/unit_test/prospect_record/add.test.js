const supertest = require('supertest');
const app = require("../../../main/app.js");
const validator = require("../../../main/validator/prospectValidator");
const PROSPECT_HELPER = require('../../../main/helpers/prospect/prospect_helper');
const ADD_HELPER = require('../../../main/helpers/prospect_record/add_helper');
const PROSPECT_IDENTIFIER_HELPER = require('../../../main/helpers/prospect_record/prospect_identifier_helper');
const domusCookie = require('../../../main/helpers/domus/domusCookie');


const add_prospect_response = [200, '{"ProspectId": 10000000}'];
const invalid_userType = { "id": 1, "userType": "UNAUTH_CUSTOMER1", "sub": "session121212", "exp": 1666343413 };
const valid_userType = { "id": 1, "userType": "UNAUTH_CUSTOMER", "sub": "session121212", "exp": 1666343413 };


describe("Add Prospect By ProspectId", () => {
    const endpoint = "/api/v1/prospect/10000000";
    const invalid_endpoint = "/api/v1/prospect/abc";

    describe("x-authorization-id not present in the request header", () => {
        it("Should return 400 along with error message", async () => {
            const { statusCode, res } = await supertest(app).put(endpoint).send();

            expect(statusCode).toBe(400);
            expect(res.text).toMatch(/\[{"message":"\\"x-authorization-id\\" is required".*/);
        })
    })

    describe("Request Params are not valid", () => {
        it("Should return 400 along with error message", async () => {
            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const { statusCode, res } = await supertest(app).put(invalid_endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(statusCode).toBe(400);
            expect(res.text).toMatch(/\[{"message":\"\\\"ProspectId\\\" must be a number.*/);
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
            expect(res.text).toMatch(/\[{"message":\"\\\"value\\\" must be an array\".*/);
        })
    })

    describe("Invalid userType", () => {
        it("Should return 400 along with error message", async () => {
            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateAddPayload_mock = jest
                .spyOn(validator, 'validateAddPayload')
                .mockReturnValueOnce(false);

            const domusReponse_mock = jest
                .spyOn(domusCookie, 'getResponsePayload')
                .mockReturnValueOnce(invalid_userType);

            const { statusCode, res } = await supertest(app).put(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateAddPayload_mock).toHaveBeenCalled();
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

            const validateAddPayload_mock = jest
                .spyOn(validator, 'validateAddPayload')
                .mockReturnValueOnce(false);

            const domusReponse_mock = jest
                .spyOn(domusCookie, 'getResponsePayload')
                .mockReturnValueOnce(valid_userType);

            const prospectId_mock = jest
                .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithSessionId')
                .mockReturnValueOnce(invalid_prospectId);

            const { statusCode, res } = await supertest(app).put(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateAddPayload_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(prospectId_mock).toHaveBeenCalled();
            expect(statusCode).toBe(404);
            expect(res.text).toBe("{\"error\":\"Prospect Record not found with userType and sub\"}");
        })
    })

    describe("Prospect not present in the tbl_prospect table", () => {
        it("Should return 404 along with error message", async () => {
            const valid_prospectId = 10000000;

            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateAddPayload_mock = jest
                .spyOn(validator, 'validateAddPayload')
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
            expect(validateAddPayload_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(prospectId_mock).toHaveBeenCalled();
            expect(tbl_prospect_mock).toHaveBeenCalled();
            expect(statusCode).toBe(404);
            expect(res.text).toBe("{\"error\":\"Prospect Record not found in Prospect table\"}");
        })
    })

    describe("ProspectId in API Request, not matching with prospectId in DB", () => {
        it("Should return 404 along with error message", async () => {
            const valid_prospectId = 10000001;

            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateAddPayload_mock = jest
                .spyOn(validator, 'validateAddPayload')
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

            const { statusCode, res } = await supertest(app).put(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateAddPayload_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(prospectId_mock).toHaveBeenCalled();
            expect(tbl_prospect_mock).toHaveBeenCalled();
            expect(statusCode).toBe(404);
            expect(res.text).toBe("{\"error\":\"ProspectId in the request is not associated with userType and sub\"}");
        })
    })

    describe("Prospect contact details are added successfully", () => {
        it("Should return 404 along with error message", async () => {
            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateAddPayload_mock = jest
                .spyOn(validator, 'validateAddPayload')
                .mockReturnValueOnce(false);

            const domusReponse_mock = jest
                .spyOn(domusCookie, 'getResponsePayload')
                .mockReturnValueOnce(valid_userType);

            const add_prospect_mock = jest
                .spyOn(ADD_HELPER, 'getResponse')
                .mockReturnValueOnce(add_prospect_response);

            const { statusCode, res } = await supertest(app).put(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateAddPayload_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(add_prospect_mock).toHaveBeenCalled();
            expect(statusCode).toBe(200);
            expect(res.text).toBe('{"ProspectId": 10000000}');
        })
    })
})


describe("Add Prospect", () => {
    const endpoint = "/api/v1/prospect";

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
            expect(res.text).toMatch(/\[{"message":\"\\\"value\\\" must be an array\".*/);
        })
    })

    describe("Invalid userType", () => {
        it("Should return 400 along with error message", async () => {
            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateAddPayload_mock = jest
                .spyOn(validator, 'validateAddPayload')
                .mockReturnValueOnce(false);

            const domusReponse_mock = jest
                .spyOn(domusCookie, 'getResponsePayload')
                .mockReturnValueOnce(invalid_userType);

            const { statusCode, res } = await supertest(app).put(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateAddPayload_mock).toHaveBeenCalled();
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

            const validateAddPayload_mock = jest
                .spyOn(validator, 'validateAddPayload')
                .mockReturnValueOnce(false);

            const domusReponse_mock = jest
                .spyOn(domusCookie, 'getResponsePayload')
                .mockReturnValueOnce(valid_userType);

            const prospectId_mock = jest
                .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithSessionId')
                .mockReturnValueOnce(invalid_prospectId);

            const { statusCode, res } = await supertest(app).put(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateAddPayload_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(prospectId_mock).toHaveBeenCalled();
            expect(statusCode).toBe(404);
            expect(res.text).toBe("{\"error\":\"Prospect Record not found with userType and sub\"}");
        })
    })

    describe("Prospect not present in the tbl_prospect table", () => {
        it("Should return 404 along with error message", async () => {
            const valid_prospectId = 10000000;

            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateAddPayload_mock = jest
                .spyOn(validator, 'validateAddPayload')
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
            expect(validateAddPayload_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(prospectId_mock).toHaveBeenCalled();
            expect(tbl_prospect_mock).toHaveBeenCalled();
            expect(statusCode).toBe(404);
            expect(res.text).toBe("{\"error\":\"Prospect Record not found in Prospect table\"}");
        })
    })

    describe("Prospect contact details are added successfully", () => {
        it("Should return 404 along with error message", async () => {
            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateAddPayload_mock = jest
                .spyOn(validator, 'validateAddPayload')
                .mockReturnValueOnce(false);

            const domusReponse_mock = jest
                .spyOn(domusCookie, 'getResponsePayload')
                .mockReturnValueOnce(valid_userType);

            const add_prospect_mock = jest
                .spyOn(ADD_HELPER, 'getResponse')
                .mockReturnValueOnce(add_prospect_response);

            const { statusCode, res } = await supertest(app).put(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateAddPayload_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(add_prospect_mock).toHaveBeenCalled();
            expect(statusCode).toBe(200);
            expect(res.text).toBe('{"ProspectId": 10000000}');
        })
    })
})
