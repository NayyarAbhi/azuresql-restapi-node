const joi = require('joi');

const xAuthSchema = joi.object({
    'x-authorization-id': joi.string().required()
});
const prospectIdSchmea = joi.object({
    ProspectId: joi.number().required()
});

function validateXAuthHeader(X_Auth_ID) {
    const { error, value } = xAuthSchema.validate(X_Auth_ID, { abortEarly: false });
    return error;
}

function validateProspectId(reqParams) {
    const { error, value } = prospectIdSchmea.validate(reqParams, { abortEarly: false });
    return error;
}

// exporting modules, to be used in the other .js files
module.exports = {  validateProspectId, validateXAuthHeader }