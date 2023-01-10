const joi = require('joi');

const addIntentSchema = joi.object({
    intent_questionaire_payload: joi.string().required(),
    active_from: joi.date().optional()
});

const xAuthSchema = joi.object({
    'x-authorization-id': joi.string().required()
});

const prospectIdSchema = joi.object({
    ProspectId: joi.number().required()
});

const findByIntentIdSchema = joi.object({
    ProspectId: joi.number().required(),
    IntentId: joi.string().required()
});


function validateProspectId(reqParams) {
    const { error, value } = prospectIdSchema.validate(reqParams, { abortEarly: false });
    return error;
}

function validateAddPayload(reqBody) {
    const { error, value } = addIntentSchema.validate(reqBody, { abortEarly: false });
    return error;
}

function validateXAuthHeader(X_Auth_ID) {
    const { error, value } = xAuthSchema.validate(X_Auth_ID, { abortEarly: false });
    return error;
}

function validateFindByIntentIdParam(reqParams) {
    const { error, value } = findByIntentIdSchema.validate(reqParams, { abortEarly: false });
    return error;
}


// exporting modules, to be used in the other .js files
module.exports = { validateProspectId, validateAddPayload, validateXAuthHeader, validateFindByIntentIdParam }
