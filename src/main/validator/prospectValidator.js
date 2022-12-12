const joi = require('joi');

const addProspectSchema = joi.object({
    ProspectId: joi.string().required(),
    IdentifierType: joi.string().required(),
    IdentifierValue: joi.string().required(),
    ActiveFrom: joi.string().required()
});


function validateAddPayload(reqBody) {
    const { error, value } = addProspectSchema.validate(reqBody, { abortEarly: false });
    return error;
}


// exporting modules, to be used in the other .js files
module.exports = { validateAddPayload }
