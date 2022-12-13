const joi = require('joi');

const prospectIdSchmea = joi.object({
    ProspectId: joi.number().required()
});

const addProspectSchema = joi.array().items(joi.object({
    IdentifierType: joi.string().required(),
    IdentifierValue: joi.string().required(),
    ActiveFrom: joi.string().required()
}));


function validateProspectId(reqParams) {
    const { error, value } = prospectIdSchmea.validate(reqParams, { abortEarly: false });
    return error;
}

function validateAddPayload(reqBody) {
    const { error, value } = addProspectSchema.validate(reqBody, { abortEarly: false });
    return error;
}


// exporting modules, to be used in the other .js files
module.exports = { validateProspectId, validateAddPayload }
