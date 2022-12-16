let PROSPECT_QUERY = require('../../variables/prospect_sql.js').QUERY;
const PROSPECT_IDENTIFIER_HELPER = require('./prospect_identifier_helper.js');
const TABLES = require('../../variables/tables.js').TABLES;
const db = require('../../utils/azureSql.js');
const HTTP = require('../../variables/status.js').HTTP;

const PROSPECT_UPDATE_COLS = ['brand_identifier', 'channel_identifier', 'first_name'];

/* segregating tbl_prospect and tbl_prospect_identifiers payload from RequestPayload
*/
function separateAddReqPayload(reqPayload) {
    let prospect_payload = [];
    let prospectIdentifier_payload = [];
    for (let value of Object.values(reqPayload)) {
        if (PROSPECT_UPDATE_COLS.includes(value.IdentifierType)) {
            prospect_payload.push(value);
        } else {
            prospectIdentifier_payload.push(value);
        }
    }
    return [prospect_payload, prospectIdentifier_payload];
}

/* getting the ProspectId from the DB, with the help of Auth userType and sub
*/
async function getProspectId(userType, sub) {
    let prospectId;
    let invalid_auth_userType = false;
    switch (userType) {
        case 'UNAUTH_CUSTOMER':
            prospectId = await PROSPECT_IDENTIFIER_HELPER.getProspectWithSessionId(sub);
            break;
        default:
            invalid_auth_userType = true;
    }
    return { prospectId, invalid_auth_userType };
}

/* getting list of columns and values to be updates in the Prospect_Identifiers table
return: 
<colName1>=<colValue1>,<colName2>=<colValue2>
*/
function getUpdateFields(payload) {
    let update_fields = '';
    const lastItem = Object.values(payload).pop();

    for (let value of Object.values(payload)) {
        update_fields += (value.IdentifierType + "='" + value.IdentifierValue + "'");
        update_fields += (value !== lastItem) ? ',' : '';
    }
    return update_fields;
}

/* updating Prospect details to the already existing Prospect
*/
async function updateProspectRecord(prospectId, reqPayload) {
    const updateQuery = PROSPECT_QUERY.UPDATE_PROSPECT
        .replace('<tableName>', TABLES.PROSPECT)
        .replace('<update_fields>', getUpdateFields(reqPayload))
        .replace('<prospectId>', prospectId);
    console.log("\nupdateQuery prospect: \n" + updateQuery);
    await db.updateRecord(updateQuery);
}

/* getting the list of IdentifierType which is required to be archived
return:
('SessionId','EmailId','MobileNumber', ....)
*/
function getIdentifierTypeList(reqPayload) {
    let updateFields = "'SessionId'";
    for (let value of Object.values(reqPayload)) {
        updateFields += (",'" + value.IdentifierType + "'");
    }
    return updateFields;
}

/* archiving the previous records by populating the ActiveTo column in Prospect_Identifiers table
*/
async function updateActiveTo(prospectId, reqPayload) {
    const updateQuery = PROSPECT_QUERY.UPDATE_ACTIVETO
        .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
        .replace('<prospectId>', prospectId)
        .replace('<identifierTypeList>', getIdentifierTypeList(reqPayload));
    console.log("\nupdateQuery prospect_identifier: \n" + updateQuery)
    await db.updateRecord(updateQuery);
}

/* getting list of values to be added in the Prospect_Identifiers table
return: 
('<prospectIdentifierId>',<prospectId>,'<identifier>','<identifierType>', '<activeFrom>')
*/
async function getInsertValues(prospectId, reqPayload) {
    let insert_Val_list = '';
    const lastItem = Object.values(reqPayload).pop();
    let max_prospectIdenId = await PROSPECT_IDENTIFIER_HELPER.getMaxProspectIdenId();

    for (let value of Object.values(reqPayload)) {
        let prospectIdenId = PROSPECT_IDENTIFIER_HELPER.getNextProspectIdenId(max_prospectIdenId);
        const insert_Val = PROSPECT_QUERY.INSERT_VALS
            .replace('<prospectIdentifierId>', prospectIdenId)
            .replace('<prospectId>', prospectId)
            .replace('<identifier>', value.IdentifierValue)
            .replace('<identifierType>', value.IdentifierType)
            .replace('<activeFrom>', value.ActiveFrom)

        insert_Val_list += insert_Val;
        insert_Val_list += (value !== lastItem) ? ',' : '';
        max_prospectIdenId = prospectIdenId;
    }
    return insert_Val_list;
}

/* adding Prospect Identifiers details to the already existing Prospect
*/
async function addProspectIdenRecord(prospectId, reqPayload) {
    const insertQuery = PROSPECT_QUERY.ADD_PROSP_IDENTIFIER
        .replace('<tableName>', TABLES.PROSPECT_IDENTIFIERS)
        .replace('<insertVals>', await getInsertValues(prospectId, reqPayload));
    console.log("\ninsertQuery prospect_identifier:\n" + insertQuery);
    await db.insertRecord(insertQuery);
}

/* doing below operation in order to add/update a prospect contact in the system.

Step1: Updating tbl_prospect record.
       For Example: updating the first_name, brand_identifier, channel_identifier of a prospect.
       Method Used --> updateProspectRecord(dbProspectId, prospect_payload)

Step2: Archiving (to maintain history) records by updating ActiveTo column in tbl_prospect_identifier.
       For Example: archiving the EmailId of a prospect, when new update comes for a EmailID.
       Method Used --> updateActiveTo(dbProspectId, prospectIdentifier_payload)

Step3: Adding new Prospect Identifier/Contact details to the already existing Prospect in the tbl_prospect_identifier.
       For Example: Adding  Mobile_Number OR Email_Id to the prospect
       Method Used --> addProspectIdenRecord(dbProspectId, prospectIdentifier_payload)
*/
async function addProspectContact(dbProspectId, reqPayload) {
    let [prospect_payload, prospectIdentifier_payload] = separateAddReqPayload(reqPayload);

    if (Object.keys(prospect_payload).length !== 0) {
        await updateProspectRecord(dbProspectId, prospect_payload);
    } else {
        console.log("\nPayload doesnot contain tbl_prospect record to be updated");
    }
    if (Object.keys(prospectIdentifier_payload).length !== 0) {
        await updateActiveTo(dbProspectId, prospectIdentifier_payload);
        await addProspectIdenRecord(dbProspectId, prospectIdentifier_payload);
    } else {
        console.log("\nPayload doesnot contain tbl_prospect_identifier record to be updated");
    }
}

/* Building a Response Payload to be sent back by the API.
   return [response_status_code, response_message]
   response_status_code: contains the response status code
   response_message: contains the response message
*/
async function getResponse(X_Auth_Add, req, ById) {
    let response_status_code;
    let response_message;
    const reqPayload = req.body;
    const auth_userType = X_Auth_Add.userType;
    const auth_sub = X_Auth_Add.sub;
    const { prospectId, invalid_auth_userType } = await getProspectId(auth_userType, auth_sub);

    if (invalid_auth_userType) {
        response_status_code = HTTP.BAD_REQUEST.code;
        response_message = { error: `Auth userType: ${auth_userType}, is not valid.` };
        return [response_status_code, response_message];
    }

    if (prospectId == null) {
        response_status_code = HTTP.NOT_FOUND.code;
        response_message = { error: `Prospect Record not found with userType:${auth_userType} and sub: ${auth_sub}` };
        return [response_status_code, response_message];
    }

    if (ById) {
        const reqProspectId = req.params.ProspectId;
        if (prospectId == reqProspectId) {
            addProspectContact(prospectId, reqPayload);
            response_status_code = HTTP.OK.code;
            response_message = { ProspectId: prospectId };
            return [response_status_code, response_message];
        } else {
            response_status_code = HTTP.NOT_FOUND.code;
            response_message = { error: `ProspectId: ${reqProspectId} in the request is not associated with userType:${auth_userType} and sub: ${auth_sub}` };
            return [response_status_code, response_message];
        }
    } else {
        addProspectContact(prospectId, reqPayload);
        response_status_code = HTTP.OK.code;
        response_message = { ProspectId: prospectId };
        return [response_status_code, response_message];
    }
}


// exporting modules, to be used in the other .js files
module.exports = { getResponse };
