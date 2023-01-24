const supertest = require('supertest');
const app = require("../../../main/app.js");
const validator = require("../../../main/validator/intentValidator");
const PROSPECT_HELPER = require('../../../main/helpers/prospect/prospect_helper');
const INTENT_HELPER = require('../../../main/helpers/intent/intent_helper');
const PROSPECT_IDENTIFIER_HELPER = require('../../../main/helpers/prospect_record/prospect_identifier_helper');
const domusCookie = require('../../../main/helpers/domus/domusCookie');


const invalid_userType = { "id": 1, "userType": "UNAUTH_CUSTOMER1", "sub": "session121212", "exp": 1666343413 };
const valid_userType = { "id": 1, "userType": "UNAUTH_CUSTOMER", "sub": "session121212", "exp": 1666343413 };
const prospect_data = [{
    "prospect_id": 10000000,
    "created_on": "2022-12-07T15:45:35.023Z",
    "brand_identifier": "brand1",
    "channel_identifier": "",
    "first_name": "name1"
}]
const intent_data = [{
    "intent_id": "INT1",
    "prospect_id": 10000000,
    "intent_questionaire_payload": "{\"CustomerIntention\":\"Customer_Intention1\",\"FirstProperty\":\"FirstProperty1\"}",
    "active_from": "2022-12-07T15:45:35.023Z",
    "active_to": null
}]
const response_payload = "{\"prospect\":[{\"prospect_id\":10000000,\"created_on\":\"2022-12-07T15:45:35.023Z\",\"brand_identifier\":\"brand1\",\"channel_identifier\":\"\",\"first_name\":\"name1\"}],\"intent\":[{\"intent_id\":\"INT1\",\"prospect_id\":10000000,\"intent_questionaire_payload\":\"{\\\"CustomerIntention\\\":\\\"Customer_Intention1\\\",\\\"FirstProperty\\\":\\\"FirstProperty1\\\"}\",\"active_from\":\"2022-12-07T15:45:35.023Z\",\"active_to\":null}]}"


describe("Find/Retrieve Intent By ProspectId and Intent Id", () => {
    const endpoint = "/api/v1/prospect/10000000/intent/INT1";
    const invalid_endpoint = "/api/v1/prospect/abc/intent/INT1";

    describe("x-authorization-id not present in the request header", () => {
        it("Should return 400 along with error message", async () => {
            const { statusCode, res } = await supertest(app).get(endpoint).send();

            expect(statusCode).toBe(400);
            expect(res.text).toMatch(/\[{"message":"\\"x-authorization-id\\" is required".*/);
        })
    })

    describe("Request Params are not valid", () => {
        it("Should return 400 along with error message", async () => {
            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const { statusCode, res } = await supertest(app).get(invalid_endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(statusCode).toBe(400);
            expect(res.text).toMatch(/\[{"message":\"\\\"ProspectId\\\" must be a number.*/);
        })
    })

    describe("Invalid userType", () => {
        it("Should return 400 along with error message", async () => {
            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateFindParams_mock = jest
                .spyOn(validator, 'validateFindParams')
                .mockReturnValueOnce(false);

            const domusReponse_mock = jest
                .spyOn(domusCookie, 'getResponsePayload')
                .mockReturnValueOnce(invalid_userType);

            const { statusCode, res } = await supertest(app).get(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateFindParams_mock).toHaveBeenCalled();
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

            const validateFindParams_mock = jest
                .spyOn(validator, 'validateFindParams')
                .mockReturnValueOnce(false);

            const domusReponse_mock = jest
                .spyOn(domusCookie, 'getResponsePayload')
                .mockReturnValueOnce(valid_userType);

            const prospectId_mock = jest
                .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithSessionId')
                .mockReturnValueOnce(invalid_prospectId);

            const { statusCode, res } = await supertest(app).get(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateFindParams_mock).toHaveBeenCalled();
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

            const validateFindParams_mock = jest
                .spyOn(validator, 'validateFindParams')
                .mockReturnValueOnce(false);

            const domusReponse_mock = jest
                .spyOn(domusCookie, 'getResponsePayload')
                .mockReturnValueOnce(valid_userType);

            const prospectId_mock = jest
                .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithSessionId')
                .mockReturnValueOnce(valid_prospectId);

            const { statusCode, res } = await supertest(app).get(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateFindParams_mock).toHaveBeenCalled();
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

            const validateFindParams_mock = jest
                .spyOn(validator, 'validateFindParams')
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

            const { statusCode, res } = await supertest(app).get(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateFindParams_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(prospectId_mock).toHaveBeenCalled();
            expect(tbl_prospect_mock).toHaveBeenCalled();
            expect(statusCode).toBe(404);
            expect(res.text).toBe("{\"error\":\"Prospect Record not found in Prospect table\"}");
        })
    })

    describe("Intent data not present in the DB", () => {
        it("Should return 404 along with error message", async () => {
            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateFindParams_mock = jest
                .spyOn(validator, 'validateFindParams')
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

            const prospectData_mock = jest
                .spyOn(PROSPECT_HELPER, 'getProspectData')
                .mockReturnValueOnce(prospect_data);

            const isIntentPresent_mock = jest
                .spyOn(INTENT_HELPER, 'getIntentData')
                .mockReturnValueOnce("");


            const { statusCode, res } = await supertest(app).get(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateFindParams_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(prospectId_mock).toHaveBeenCalled();
            expect(tbl_prospect_mock).toHaveBeenCalled();
            expect(prospectData_mock).toHaveBeenCalled();
            expect(isIntentPresent_mock).toHaveBeenCalled();
            expect(statusCode).toBe(404);
            expect(res.text).toBe("{\"error\":\"No Intent Record found with ProspectId\"}");
        })
    })

    describe("Intent data present in the DB", () => {
        it("Should return 200 along with response payload", async () => {
            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateFindParams_mock = jest
                .spyOn(validator, 'validateFindParams')
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

            const prospectData_mock = jest
                .spyOn(PROSPECT_HELPER, 'getProspectData')
                .mockReturnValueOnce(prospect_data);

            const isIntentPresent_mock = jest
                .spyOn(INTENT_HELPER, 'getIntentData')
                .mockReturnValueOnce(intent_data);

            const { statusCode, res } = await supertest(app).get(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateFindParams_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(prospectId_mock).toHaveBeenCalled();
            expect(tbl_prospect_mock).toHaveBeenCalled();
            expect(prospectData_mock).toHaveBeenCalled();
            expect(isIntentPresent_mock).toHaveBeenCalled();
            expect(statusCode).toBe(200);
            expect(res.text).toBe(response_payload);
        })
    })
})


describe("Find/Retrieve Active Intent By ProspectId", () => {
    const endpoint = "/api/v1/prospect/10000000/intent";
    const invalid_endpoint = "/api/v1/prospect/abc/intent";

    describe("x-authorization-id not present in the request header", () => {
        it("Should return 400 along with error message", async () => {
            const { statusCode, res } = await supertest(app).get(endpoint).send();

            expect(statusCode).toBe(400);
            expect(res.text).toMatch(/\[{"message":"\\"x-authorization-id\\" is required".*/);
        })
    })

    describe("Request Params are not valid", () => {
        it("Should return 400 along with error message", async () => {
            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const { statusCode, res } = await supertest(app).get(invalid_endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(statusCode).toBe(400);
            expect(res.text).toMatch(/\[{"message":\"\\\"ProspectId\\\" must be a number.*/);
        })
    })

    describe("Invalid userType", () => {
        it("Should return 400 along with error message", async () => {
            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateProspectId_mock = jest
                .spyOn(validator, 'validateProspectId')
                .mockReturnValueOnce(false);

            const domusReponse_mock = jest
                .spyOn(domusCookie, 'getResponsePayload')
                .mockReturnValueOnce(invalid_userType);

            const { statusCode, res } = await supertest(app).get(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateProspectId_mock).toHaveBeenCalled();
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

            const validateProspectId_mock = jest
                .spyOn(validator, 'validateProspectId')
                .mockReturnValueOnce(false);

            const domusReponse_mock = jest
                .spyOn(domusCookie, 'getResponsePayload')
                .mockReturnValueOnce(valid_userType);

            const prospectId_mock = jest
                .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithSessionId')
                .mockReturnValueOnce(invalid_prospectId);

            const { statusCode, res } = await supertest(app).get(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateProspectId_mock).toHaveBeenCalled();
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

            const validateProspectId_mock = jest
                .spyOn(validator, 'validateProspectId')
                .mockReturnValueOnce(false);

            const domusReponse_mock = jest
                .spyOn(domusCookie, 'getResponsePayload')
                .mockReturnValueOnce(valid_userType);

            const prospectId_mock = jest
                .spyOn(PROSPECT_IDENTIFIER_HELPER, 'getProspectWithSessionId')
                .mockReturnValueOnce(valid_prospectId);

            const { statusCode, res } = await supertest(app).get(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateProspectId_mock).toHaveBeenCalled();
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

            const validateProspectId_mock = jest
                .spyOn(validator, 'validateProspectId')
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

            const { statusCode, res } = await supertest(app).get(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateProspectId_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(prospectId_mock).toHaveBeenCalled();
            expect(tbl_prospect_mock).toHaveBeenCalled();
            expect(statusCode).toBe(404);
            expect(res.text).toBe("{\"error\":\"Prospect Record not found in Prospect table\"}");
        })
    })

    describe("Inactive intent data present in the DB", () => {
        it("Should return 404 along with error message", async () => {
            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateProspectId_mock = jest
                .spyOn(validator, 'validateProspectId')
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

            const prospectData_mock = jest
                .spyOn(PROSPECT_HELPER, 'getProspectData')
                .mockReturnValueOnce(prospect_data);

            const activeIntentData_mock = jest
                .spyOn(INTENT_HELPER, 'getActiveIntentData')
                .mockReturnValueOnce("");

            const { statusCode, res } = await supertest(app).get(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateProspectId_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(prospectId_mock).toHaveBeenCalled();
            expect(tbl_prospect_mock).toHaveBeenCalled();
            expect(prospectData_mock).toHaveBeenCalled();
            expect(activeIntentData_mock).toHaveBeenCalled();
            expect(statusCode).toBe(404);
            expect(res.text).toBe("{\"error\":\"No Active Intent Record found with ProspectId\"}");
        })
    })

    describe("Intent data present in the DB", () => {
        it("Should return 200 along with response payload", async () => {
            const validateXAuth_mock = jest
                .spyOn(validator, 'validateXAuthHeader')
                .mockReturnValueOnce(false);

            const validateProspectId_mock = jest
                .spyOn(validator, 'validateProspectId')
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

            const prospectData_mock = jest
                .spyOn(PROSPECT_HELPER, 'getProspectData')
                .mockReturnValueOnce(prospect_data);

            const activeIntentData_mock = jest
                .spyOn(INTENT_HELPER, 'getActiveIntentData')
                .mockReturnValueOnce(intent_data);

            const { statusCode, res } = await supertest(app).get(endpoint).send();

            expect(validateXAuth_mock).toHaveBeenCalled();
            expect(validateProspectId_mock).toHaveBeenCalled();
            expect(domusReponse_mock).toHaveBeenCalled();
            expect(prospectId_mock).toHaveBeenCalled();
            expect(tbl_prospect_mock).toHaveBeenCalled();
            expect(prospectData_mock).toHaveBeenCalled();
            expect(activeIntentData_mock).toHaveBeenCalled();
            expect(statusCode).toBe(200);
            expect(res.text).toBe(response_payload);
        })
    })
})