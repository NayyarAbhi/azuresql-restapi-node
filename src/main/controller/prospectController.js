const HTTP = require('../variables/status.js').HTTP;
const validator = require('../validator/prospectValidator');
const FIND_HELPER = require('../helpers/prospect_record/find_helper.js');
const ADD_HELPER = require('../helpers/prospect_record/add_helper');
const CREATE_HELPER = require('../helpers/prospect_record/create_helper');
const domusCookie = require('../helpers/domus/domusCookie.js');


// creating the prospect, if the customer id does not exist in the system
async function createProspect(req, res) {

    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };
    const [response_status_code_1, response_message_1] = await CREATE_HELPER.xAauthValidation(authObj, req.body);

    if (response_message_1 === "X_AUTH passes") {
        let domus_cookie_response = await domusCookie.getResponsePayload(req.headers['x-authorization-id']);
        const [response_status_code, response_message] = await CREATE_HELPER.getResponse(domus_cookie_response, req);
        res.status(response_status_code).send(response_message);
    } else {
        res.status(response_status_code_1).send(response_message_1)

    }

}

/* Add Prospect API to add Prospect contact details by ProspectId to the already existing Prospect
*/
async function addProspectById(req, res) {
    const reqParams = req.params;
    const reqPayload = req.body;
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };

    if (error = (validator.validateXAuthHeader(authObj) || validator.validateProspectId(reqParams) || validator.validateAddPayload(reqPayload))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    // getting domus reponse payload
    let domus_cookie_response = await domusCookie.getResponsePayload(req.headers['x-authorization-id']);

    // getting reponse status code and message
    const [response_status_code, response_message] = await ADD_HELPER.getResponse(domus_cookie_response, req, true);
    res.status(response_status_code)
        .send(response_message);
}

/* Add Prospect API to add Prospect contact details to the already existing Prospect
*/
async function addProspect(req, res) {
    const reqPayload = req.body;
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };

    if (error = (validator.validateXAuthHeader(authObj) || validator.validateAddPayload(reqPayload))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    // getting domus reponse payload
    let domus_cookie_response = await domusCookie.getResponsePayload(req.headers['x-authorization-id']);

    // getting reponse status code and message
    const [response_status_code, response_message] = await ADD_HELPER.getResponse(domus_cookie_response, req, false);
    res.status(response_status_code)
        .send(response_message);
}

/* Find Prospect API to retrieve Prospect details
*/
async function findProspect(req, res) {
    const reqBody = req.body;
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };
    console.log(authObj)

    //validate request body and x-authrization-id are not empty
    if (error = (validator.validateXAuthHeader(authObj) || validator.validateFindPayload(reqBody))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    // getting domus reponse payload
    let domus_cookie_response = await domusCookie.getResponsePayload(req.headers['x-authorization-id']);

    const result = await FIND_HELPER.findProspect(domus_cookie_response, req);
    console.log(result.error);

    if (result.error == null) {
        res.status(HTTP.OK.code)
            .send(result);
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .send(result);
    }
}

/* Find Prospect API to retrieve Prospect details
*/
async function findProspectById(req, res) {
    const reqParams = req.params;
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };

    //validate the request data and headers
    if (error = (validator.validateXAuthHeader(authObj) || validator.validateProspectId(reqParams))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    // getting domus reponse payload
    let domus_cookie_response = await domusCookie.getResponsePayload(req.headers['x-authorization-id']);

    const result = await FIND_HELPER.findProspectById(domus_cookie_response, req);
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
module.exports = { createProspect, addProspectById, addProspect, findProspectById, findProspect }
