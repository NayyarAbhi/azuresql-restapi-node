const HTTP = require('../variables/status').HTTP;
const validator = require('../validator/intentValidator');
const FIND_HELPER = require('../helpers/intent/find_helper');
const UPDATE_HELPER = require('../helpers/intent/update_helper');
const CREATE_HELPER = require('../helpers/intent/create_helper');
let X_Auth = require('../variables/x-authorisation.json');
let X_Auth_Find = require('../variables/x-auth-id-find.json');
const X_Auth_Add = require('../variables/x-auth-add.json');

// Adding the intent of the prospect, if the prospect id exist in the records
async function addIntent(req, res) {
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };

    if (error = (validator.validateXAuthHeader(authObj) || validator.validateAddPayload(req.body) || validator.validateProspectId(req.params))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }
    const [response_status_code, response_message] = await CREATE_HELPER.getResponse(X_Auth, req);
    res.status(response_status_code)
        .send(response_message);

}

/* 
To retrieve Intent details based on IntentId and ProspectId
*/
async function findByIntentIdProspectId(req, res) {
    const reqParams = req.params;
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };

    if (error = (validator.validateXAuthHeader(authObj) || validator.validateFindParams(reqParams))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    const [response_status_code, response_message] = await FIND_HELPER.getResponse(X_Auth_Find[0], req, "IntentIdProspectId");
    res.status(response_status_code)
        .send(response_message);
}

/* To retrieve active Intent details based on ProspectId
*/
async function findByProspectId(req, res) {
    const reqParams = req.params;
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };

    if (error = (validator.validateXAuthHeader(authObj) || validator.validateProspectId(reqParams))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    const [response_status_code, response_message] = await FIND_HELPER.getResponse(X_Auth_Find[0], req, "ProspectId");
    res.status(response_status_code)
        .send(response_message);
}

/* 
To update Intent details based on IntentId and ProspectId
*/
async function updateIntent(req, res) {
    const reqParams = req.params;
    const reqPayload = req.body;
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };

    if (error = (validator.validateXAuthHeader(authObj) || validator.validateUpdateSchema({ ...reqParams, ...reqPayload }))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    const [response_status_code, response_message] = await UPDATE_HELPER.getResponse(X_Auth_Add, req);
    res.status(response_status_code)
        .send(response_message);
}


// exporting modules, to be used in the api router
module.exports = { addIntent, findByIntentIdProspectId, findByProspectId, updateIntent }
