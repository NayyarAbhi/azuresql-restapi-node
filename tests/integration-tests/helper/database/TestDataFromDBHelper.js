//importing packages
const {performDBOperation}  = require('./DBRequestExecutionHelper');
//import QUERY from '../../../main/variables/otp_sql';
const { QUERY } = require('../variables/sqls');

async function getAnyRandomTestDataFromDB(identifier_type) {
    let sql;
    try{
        sql = QUERY.FIND_VALID_PROSPECT_AND_ASSOCIATED_IDENTIFIER
                .replace('<SessionId>', identifier_type);
    }catch(err){
        console.log(err);
    }

    let test_data = {};
    try {
        const result = await performDBOperation(sql);
        if (result.rowsAffected[0] !== 1) {
            expect.fail("the test has filed : No record found in the Record Table");
        } else {
            test_data = {
                prospect_ID: result.recordset[0].prospect_ID,
                identifier: result.recordset[0].identifier,
            }
        }

    } catch (err) {
        throw err;
    }
    try {
        const sql2 = QUERY.FIND_VALID_PROSPECT_IDENTIFIER_FOR_PROSPECT
            .replace('<prospect_id>', test_data.prospect_ID);

        const result2 = await performDBOperation(sql2);
        
        if (result2.rowsAffected[0] !== 1) {
            expect.fail("the test has filed : No record found in the Record Table for a given prospect");
        } else {
            test_data.IdentifierType = result2.recordset[0].IdentifierType;
            test_data.IdentifierValue = result2.recordset[0].IdentifierValue;
        }
    } catch (err) {
        throw err;
    }
    try {
        const sql3 = QUERY.FIND_VALID_PROSPECT_IDENTIFIER_FOR_ANY_OTHER_PROSPECT
            .replace('<prospect_id>', test_data.prospect_ID);

        const result3 = await performDBOperation(sql3);
        
        if (result3.rowsAffected[0] !== 1) {
            expect.fail("the test has filed : No record found in the Record Table for a given prospect");
        } else {
            test_data.IdentifierType_other = result3.recordset[0].IdentifierType;
            test_data.IdentifierValue_other = result3.recordset[0].IdentifierValue;
            test_data.prospect_ID_other = result3.recordset[0].PorspectID;
        }
    } catch (err) {
        throw err;
    }
    return test_data;
}



async function getProspectAndProspectIdentifierRecordFromDB(prospect_id, identifierType, identifierValue) {

    const sql_prospect = QUERY.SELECT_PROSPECT
        .replace('<prospect_id>', prospect_id);

    let sql_prospect_identifier;
    let verification_object = {};

    if(typeof identifierType === "undefined"){
        sql_prospect_identifier = QUERY.SELECT_PROSPECT_IDENTIFIER
        .replace('<prospect_id>', prospect_id);
    }else{
        sql_prospect_identifier = QUERY.SELECT_PROSPECT_IDENTIFIER_BY_TYPE_AND_VALUE
        .replace('<prospect_id>', prospect_id)
        .replace('<identifierType>',identifierType)
        .replace('<identifierValue>',identifierValue)
    }

    try {
        const prospect = (await performDBOperation(sql_prospect)).recordset;
        
        if(typeof identifierType === "undefined"){
            const prospect_identifiers = (await performDBOperation(sql_prospect_identifier)).recordset;
            verification_object = { prospect, prospect_identifiers }
        }else{
            const prospect_identifier = (await performDBOperation(sql_prospect_identifier)).recordset;
            verification_object = { prospect, prospect_identifier }
        }
    } catch (err) {
        throw err;
    }
    return verification_object;
}

async function getProspectIDNotInProspectIdentifier() {
    const sql_prospect = QUERY.FIND_PROSPECT_NOT_IN_PROSPECT_IDENTIFIER;

    const sql_prospect_identifier = QUERY.FIND_ANY_PROSPECT_IDENTIFIER;

    let verification_object = {};

    try {
        const prospect = await performDBOperation(sql_prospect);
        const prospect_identifiers = await performDBOperation(sql_prospect_identifier);
        verification_object = {
            prospect_id: prospect.recordset[0].prospect_id,
            identifier: prospect_identifiers.recordset[0].identifier,
            identifier_associated_with: prospect_identifiers.recordset[0].prospect_id
        }
    } catch (err) {
        throw err;
    }
    return verification_object;
}


module.exports = { getAnyRandomTestDataFromDB, getProspectAndProspectIdentifierRecordFromDB, getProspectIDNotInProspectIdentifier };
