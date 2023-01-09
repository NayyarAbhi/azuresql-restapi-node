const HTTP = require('../variables/status.js').HTTP;
const validator = require('../validator/intentValidator');
const FIND_HELPER = require('../helpers/intent/find_helper.js');
const CREATE_HELPER = require('../helpers/intent/create_helper');
let X_Auth = require('../variables/x-authorisation.json');
let X_Auth_Find = require('../variables/x-auth-id-find.json');

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

module.exports = { addIntent }
