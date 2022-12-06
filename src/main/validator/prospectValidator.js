const joi = require('joi');

const updateProspectSchema = joi.object({
    CustomerId: joi.string().required(),
    Cookie: joi.string().optional(),
    SessionId: joi.string().optional(),
    OtpEmailId: joi.string().optional(),
    DomusCookieId: joi.string().optional(),
    IBLogon: joi.string().optional()
});

const createProspectSchema = joi.object({
    customerId: joi.string().required(),
    Cookie: joi.string().required(),
    SessionId: joi.string().required(),
    OtpEmailId: joi.string().required(),
    DomusCookieId: joi.string().required(),
    IBLogon: joi.string().required()
});

function validateUpdatePayload(reqBody) {
    const { error, value } = updateProspectSchema.validate(reqBody, { abortEarly: false });
    return error;
}

function validateCreatePayload(reqBody) {
    const { error, value } = createProspectSchema.validate(reqBody, { abortEarly: false });
    return error;
}


// exporting modules, to be used in the other .js files
module.exports = { validateUpdatePayload, validateCreatePayload }
