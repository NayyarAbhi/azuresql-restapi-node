const HTTP = require('../variables/status.js').HTTP;
const validator = require('../validator/prospectValidator.js');
const CREATE_HELPER = require('../helpers/prospect_information/create_helper');
const FIND_HELPER = require('../helpers/prospect_information/find_helper.js');
const domusCookie = require('../helpers/domus/domusCookie.js');

// Adding the intent of the prospect, if the prospect id exist in the records
async function createProspectInformation(req, res) {
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };
    const [response_status_code_1, response_message_1] = await CREATE_HELPER.xAauthValidation(authObj, req.body);
    
        if (response_message_1 === "X_AUTH passes") {
            // getting domus reponse payload
            let domus_cookie_response = await domusCookie.getResponsePayload();
            const [response_status_code, response_message] = await CREATE_HELPER.getResponse(domus_cookie_response, req);
            res.status(response_status_code).send(response_message);
        } else {
           res.status(response_status_code_1).send(response_message_1)
        }
}

/* Find Prospect Information API to retrieve Prospect Information details
*/
async function findProspectInfoByProspectId(req, res) {
    const reqParams = req.params;
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };
    console.log(authObj)

    //validate request body and x-authrization-id are not empty 
    if (error = (validator.validateXAuthHeader(authObj) || validator.validateProspectId(reqParams))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    // getting domus reponse payload
    let domus_cookie_response = await domusCookie.getResponsePayload();

    const result = await FIND_HELPER.findProspectInfoByProspectId(domus_cookie_response, req);
    console.log(result.error);

    if (result.error == null) {
        res.status(HTTP.OK.code)
            .send(result);
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .send(result);
    }
}

/* Find Prospect Information by ProspectId and PayloadIdentifier
*/
async function findProspectInfoByPayloadIdentifier(req, res) {
    const reqParams = req.params;
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };
    console.log(reqParams)

    //validate request body and x-authrization-id are not empty
    if (error = (validator.validateXAuthHeader(authObj) || validator.validateProspectInformationSchema(reqParams))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    // getting domus reponse payload
    let domus_cookie_response = await domusCookie.getResponsePayload();

    const result = await FIND_HELPER.findProspectInfoByPayloadIdentifier(domus_cookie_response, req);
    console.log(result.error);

    if (result.error == null) {
        res.status(HTTP.OK.code)
            .send(result);
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .send(result);
    }
}

/* Find Prospect Information by ProspectId and PayloadIdentifier
*/
async function findProspectInfoByPayloadIdentifierAndPayloadId(req, res) {
    const reqParams = req.params;
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };
    console.log(reqParams)

    //validate request body and x-authrization-id are not empty
    if (error = (validator.validateXAuthHeader(authObj) || validator.validateProspectInformationPayloadIdSchema(reqParams))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    // getting domus reponse payload
    let domus_cookie_response = await domusCookie.getResponsePayload();

    const result = await FIND_HELPER.findProspectInfoByPayloadIdentifierAndPayloadId(domus_cookie_response, req);
    console.log(result.error);

    if (result.error == null) {
        res.status(HTTP.OK.code)
            .send(result);
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .send(result);
    }
}

// exporting modules, to be used in the api router
module.exports = { createProspectInformation, findProspectInfoByProspectId, findProspectInfoByPayloadIdentifier, findProspectInfoByPayloadIdentifierAndPayloadId }