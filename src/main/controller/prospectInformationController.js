const HTTP = require('../variables/status.js').HTTP;
const validator = require('../validator/prospectValidator.js');
const infovalidator = require('../validator/prospectInformationValidator');
const CREATE_HELPER = require('../helpers/prospect_information/create_helper');
const FIND_HELPER = require('../helpers/prospect_information/find_helper.js');
let X_Auth = require('../variables/x-authorisation.json');
let X_Auth_Find = require('../variables/x-auth-id-find.json');
const X_Auth_Add = require('../variables/x-auth-add.json');

// Adding the intent of the prospect, if the prospect id exist in the records
async function createProspectInformation(req, res) {
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };

    if (error = (validator.validateXAuthHeader(authObj) || validator.validateAddPayload(req.body) || validator.validateProspectId(req.params))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }
    const [response_status_code, response_message] = await CREATE_HELPER.getResponse(X_Auth, req);
    res.status(response_status_code)
        .send(response_message);

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

    const result = await FIND_HELPER.findProspectInfoByProspectId(req);
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

    const result = await FIND_HELPER.findProspectInfoByPayloadIdentifier(req);
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

    const result = await FIND_HELPER.findProspectInfoByPayloadIdentifierAndPayloadId(req);
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
module.exports = { findProspectInfoByProspectId, findProspectInfoByPayloadIdentifier, findProspectInfoByPayloadIdentifierAndPayloadId }