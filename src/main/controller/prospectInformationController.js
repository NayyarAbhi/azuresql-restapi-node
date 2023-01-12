const HTTP = require('../variables/status.js').HTTP;
//const validator = require('../validator/prospectInformationValidator.js');
const validator = require('../validator/prospectValidator.js');
const FIND_HELPER = require('../helpers/prospect-information/find_helper.js');
let X_Auth = require('../variables/x-authorisation.json');
let X_Auth_Find = require('../variables/x-auth-id-find.json');
const X_Auth_Add = require('../variables/x-auth-add.json');

/* Find Prospect Information API to retrieve Prospect Information details
*/
async function findProspectInfoByProspectId(req, res) {
    const reqParams = req.params;
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };
    console.log(authObj)

    //validate request body and x-authrization-id are not empty
    if (error = (validator.validateXAuthHeader(authObj) || validator.validateProspectInformationSchmea(reqParams))) {
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
