const joi = require('joi');

const getProspectSchema = joi.object({
    customerId: joi.string().required()
});

const updateProspectSchema = joi.object({
    CustomerId: joi.string().required(),
    Cookie: joi.string().optional(),
    SessionId: joi.string().optional(),
    OtpEmailId: joi.string().optional(),
    DomusCookieId: joi.string().optional(),
    IBLogon: joi.string().optional()
});

function validateGetSchema(queryParam) {
    const { error, value } = getProspectSchema.validate(queryParam, { abortEarly: false });
    return error;
}

function validateUpdateSchema(reqBody) {
    const { error, value } = updateProspectSchema.validate(reqBody, { abortEarly: false });
    return error;
}


// exporting modules, to be used in the other .js files
module.exports = { validateGetSchema, validateUpdateSchema }
