const joi = require('joi');

const createProspectSchema = joi.object({
    created_on: joi.date().required(),
    brand_identifier: joi.string().required(),
    channel_identifier: joi.string().optional(),
    first_name: joi.string().optional()
});

const xAuthSchema = joi.object({
    'x-authorization-id': joi.string().required()
});
const prospectIdSchmea = joi.object({
    ProspectId: joi.number().required()
});

const addProspectSchema = joi.array().items(joi.object({
    IdentifierType: joi.string().required(),
    IdentifierValue: joi.string().required(),
    ActiveFrom: joi.date().required()
}));

const findProspectSchema = joi.object({
    IdentifierType: joi.string().required(),
    IdentifierValue: joi.string().required()
});

function validateProspectId(reqParams) {
    const { error, value } = prospectIdSchmea.validate(reqParams, { abortEarly: false });
    return error;
}

function validateCreatePayload(reqBody) {
    const { error, value } = createProspectSchema.validate(reqBody, { abortEarly: false });
    return error;
}

function validateAddPayload(reqBody) {
    const { error, value } = addProspectSchema.validate(reqBody, { abortEarly: false });
    return error;
}

function validateFindPayload(reqBody) {
    const { error, value } = findProspectSchema.validate(reqBody, { abortEarly: false });
    return error;
}

function validateXAuthHeader(X_Auth_ID) {
    const { error, value } = xAuthSchema.validate(X_Auth_ID, { abortEarly: false });
    return error;
}



// exporting modules, to be used in the other .js files
module.exports = { validateCreatePayload, validateProspectId, validateAddPayload, validateFindPayload, validateXAuthHeader }