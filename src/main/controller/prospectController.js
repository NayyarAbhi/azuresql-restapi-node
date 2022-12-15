const db = require('../utils/azureSql.js');
const TABLES = require('../variables/tables.js').TABLES;
const HTTP = require('../variables/status.js').HTTP;
const validator = require('../validator/prospectValidator');
let PROSPECT_QUERY = require('../variables/prospect_sql.js').QUERY;
const PROSPECT_HELPER = require('../helpers/prospect/prospect_helper.js');
const PROSPECT_IDENTIFIER_HELPER = require('../helpers/prospect-record/prospect_identifier_helper.js');
let IDENTIFIER = require('../variables/identifier.js').IDENTIFIER;
const FIND_HELPER = require('../helpers/prospect-record/find_helper.js');
const ADD_HELPER = require('../helpers/prospect-record/add_helper');
let X_Auth = require('../variables/x-authorisation.json');
let X_Auth_Find = require('../variables/x-auth-id-find.json');
const X_Auth_Add = require('../variables/x-auth-add.json');


// creating the prospect, if the customer id does not exist in the system
async function createProspect(req, res) {
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };

    if (error = (validator.validateXAuthHeader(authObj) || validator.validateCreatePayload(req.body))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    var ProspectIdfromDB
    var usertype = X_Auth[0].userType
    if (usertype === 'UNAUTH_CUSTOMER') {
        ProspectIdfromDB = await PROSPECT_IDENTIFIER_HELPER.getProspectWithSessionId(X_Auth[0].sub)
    } else if (usertype === 'IB_CUSTOMER') {
        ProspectIdfromDB = await PROSPECT_IDENTIFIER_HELPER.getProspectWithIBID(X_Auth[0].sub)
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ message: `User_Type: ${usertype} is invalid.` });
        return
    }
    if (ProspectIdfromDB == null) {
        var prevProspectId = await PROSPECT_HELPER.getMaxProspectId();
        var newProspectId = prevProspectId == null ? 10000000 : (parseInt(prevProspectId) + 1);
        const insertProspectQuery = PROSPECT_QUERY.INSERT_PROSPECT
            .replace('<tableName>', TABLES.PROSPECT)
            .replace('<prospect_id>', newProspectId)
            .replace('<first_name>', req.body.first_name == undefined ? '' : req.body.first_name)
            .replace('<created_on>', req.body.created_on)
            .replace('<brand_identifier>', req.body.brand_identifier)
            .replace('<channel_identifier>', req.body.channel_identifier == undefined ? '' : req.body.channel_identifier);

        const prospectInsertResult = await db.insertRecord(insertProspectQuery);

        var prevProspectIdentifierId = await PROSPECT_IDENTIFIER_HELPER.getMaxProspectIdenId();
        var newProspectIdentifierId = PROSPECT_IDENTIFIER_HELPER.getNextProspectIdenId(prevProspectIdentifierId)

        var usertype = X_Auth[0].userType
        if (usertype === 'UNAUTH_CUSTOMER') {
            var insertProspectIdentifierQuery = PROSPECT_QUERY.INSERT_PROSPECT_IDENTIFIERS
                .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
                .replace('<prospect_identifier_id>', newProspectIdentifierId)
                .replace('<prospect_id>', newProspectId)
                .replace('<identifier_type>', 'SessionId')
                .replace('<identifier>', X_Auth[0].sub)

        } else {
            var insertProspectIdentifierQuery = PROSPECT_QUERY.INSERT_PROSPECT_IDENTIFIERS
                .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
                .replace('<prospect_identifier_id>', newProspectIdentifierId)
                .replace('<prospect_id>', newProspectId)
                .replace('<identifier_type>', 'IBID')
                .replace('<identifier>', X_Auth[0].sub)
        }

        const prospectIdentifierInsertResult = await db.insertRecord(insertProspectIdentifierQuery);

        res.status(HTTP.OK.code)
            .json({ message: `ProspectId ${newProspectId} is created successfully` })

    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ message: `ProspectId: ${ProspectIdfromDB}, already exist in the system.` });
    }
}

/* Add Prospect API to add Prospect contact details by ProspectId to the already existing Prospect
*/
async function addProspectById(req, res) {
    const reqParams = req.params;
    const reqPayload = req.body;
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };

    if (error = (validator.validateXAuthHeader(authObj) || validator.validateProspectId(reqParams) || validator.validateAddPayload(reqPayload))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    if (!(ADD_HELPER.VALID_USER_TYPE.includes(X_Auth_Add.userType))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .json({ error: `Auth userType: ${X_Auth_Add.userType}, is not valid.` });
    }

    const reqProspectId = reqParams.ProspectId;
    const dbProspectId = await PROSPECT_IDENTIFIER_HELPER.getProspectWithSessionId(X_Auth_Add.sub);
    if (dbProspectId == null) {
        return res.status(HTTP.NOT_FOUND.code)
            .json({ error: `Prospect Record not found with userType:${X_Auth_Add.userType} and sub: ${X_Auth_Add.sub}` });
    }

    if (dbProspectId == reqProspectId) {
        ADD_HELPER.addProspectContact(dbProspectId, reqPayload);
        res.status(HTTP.OK.code)
            .json({ ProspectId: dbProspectId });
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ error: `ProspectId: ${reqProspectId} in the request is not associated with userType:${X_Auth_Add.userType} and sub: ${X_Auth_Add.sub}` });
    }
}

/* Add Prospect API to add Prospect contact details to the already existing Prospect
*/
async function addProspect(req, res) {
    const reqPayload = req.body;
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };

    if (error = (validator.validateXAuthHeader(authObj) || validator.validateAddPayload(reqPayload))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    if (!(ADD_HELPER.VALID_USER_TYPE.includes(X_Auth_Add.userType))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .json({ error: `Auth userType: ${X_Auth_Add.userType}, is not valid.` });
    }

    const dbProspectId = await PROSPECT_IDENTIFIER_HELPER.getProspectWithSessionId(X_Auth_Add.sub);
    if (dbProspectId == null) {
        return res.status(HTTP.NOT_FOUND.code)
            .json({ error: `Prospect Record not found with userType:${X_Auth_Add.userType} and sub: ${X_Auth_Add.sub}` });
    }

    ADD_HELPER.addProspectContact(dbProspectId, reqPayload);
    res.status(HTTP.OK.code)
        .json({ ProspectId: dbProspectId });
}

/* Find Prospect API to retrieve Prospect details
*/
async function findProspect(req, res) {
    const reqBody = req.body;
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };
    console.log(authObj)

    //validate request body and x-authrization-id are not empty
    if (error = (validator.validateXAuthHeader(authObj) || validator.validateFindPayload(reqBody))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    const result = await FIND_HELPER.findProspect(req);
    console.log(result.error);

    if (result.error == null) {
        res.status(HTTP.OK.code)
            .send(result);
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .send(result);
    }
}

/* Find Prospect API to retrieve Prospect details
*/
async function findProspectById(req, res) {
    const reqParams = req.params;
    const prospectId = reqParams.ProspectId;
    const authObj = { 'x-authorization-id': req.headers['x-authorization-id'] };

    //validate the request data and headers
    if (error = (validator.validateXAuthHeader(authObj) || validator.validateProspectId(reqParams))) {
        return res.status(HTTP.BAD_REQUEST.code)
            .send(error.details);
    }

    const result = await FIND_HELPER.findProspectById(req);
    console.log(result.error);

    if (result.error == null) {
        res.status(HTTP.OK.code)
            .send(result);
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .send(result);
    }

}


// exporting modules, to be used in the other .js files
module.exports = { createProspect, addProspectById, addProspect, findProspectById, findProspect }
