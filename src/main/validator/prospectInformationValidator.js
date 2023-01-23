const joi = require('joi');

const createProspectInfoSchema = joi.object({
    payload_identifier: joi.required(),
    payload_body: joi.required(),
    active_from: joi.date().required()
});

const xAuthSchema = joi.object({
    'x-authorization-id': joi.string().required()
});

const prospectIdSchema = joi.object({
    ProspectId: joi.number().required()
});

function validateProspectId(reqParams) {
    const { error, value } = prospectIdSchema.validate(reqParams, { abortEarly: false });
    return error;
}

function validateCreateProspectInfo(reqBody) {
    const { error, value } = createProspectInfoSchema.validate(reqBody, { abortEarly: false });
    return error;
}

function validateXAuthHeader(X_Auth_ID) {
    const { error, value } = xAuthSchema.validate(X_Auth_ID, { abortEarly: false });
    return error;
}


// exporting modules, to be used in the other .js files
module.exports = { validateProspectId, validateCreateProspectInfo, validateXAuthHeader }
