const TBL_PROSPECT_QUERY = {
    RECORD_COUNT: "SELECT COUNT(*) as RECORD_COUNT FROM <tableName> WHERE prospect_id=<prospectId>",
    GET_PROSPECT_ID: "SELECT max(prospect_id) as MAXPROSPECTID from <tableName>",
    GET_PROSPECT_WITH_SESSION_ID: "SELECT prospect_id from <tableName> WHERE identifier='<identifier>' and identifier_type='SessionId'",
    GET_PROSPECT_WITH_IBID: "SELECT prospect_id from <tableName> WHERE identifier='<identifier>' and identifier_type='IBID'",
    GET_PROSPECT_IDENTIFIER_ID: "SELECT MAX(CAST(SUBSTRING(prospect_identifier_id,4,len(prospect_identifier_id)) as int))as MAXPROSPECTIDENTIFIERID from <tableName>",
    GET_PROSPECT_DATA: "SELECT * FROM <tableName> WHERE prospect_id=<prospectId>"
}

const TBL_PROSPECT_IDENTIFIER_QUERY = {
    UPDATE_PROSPECT: "UPDATE <tableName> SET <update_fields> WHERE prospect_id=<prospectId>",
    UPDATE_ACTIVETO: "UPDATE <tableName> SET active_to=GETDATE() WHERE prospect_id=<prospectId> and identifier_type in (<identifierTypeList>) and active_to is NULL",
    INSERT_VALS: "('<prospectIdentifierId>',<prospectId>,'<identifier>','<identifierType>', CAST('<activeFrom>' as datetime))",
    ADD_PROSP_IDENTIFIER: "INSERT INTO <tableName> (prospect_identifier_id, prospect_id, identifier, identifier_type, active_from) VALUES <insertVals>",
    INSERT_PROSPECT: "INSERT INTO <tableName> (prospect_id,created_on,brand_identifier,channel_identifier,first_name) values  (<prospect_id>,CAST('<created_on>' as datetime),'<brand_identifier>','<channel_identifier>','<first_name>')",
    INSERT_PROSPECT_IDENTIFIERS: "INSERT INTO <tableName> (prospect_identifier_id,prospect_id,identifier,identifier_type,active_from) values ('<prospect_identifier_id>',<prospect_id>,'<identifier>','<identifier_type>',GETDATE())",
    PROSPECT_IDENTIFIER_VALUES_BY_IDENTIFIER_TYPE_AND_VALUE: "SELECT * FROM <tableName> WHERE identifier_type='<IdentifierType>' and identifier='<IdentifierValue>'",
    PROSPECT_VALUES_BY_PROSPECT_ID: "SELECT *  FROM <tableName> WHERE prospect_id=<prospect_id>",
    PROSPECT_IDENTIFIER_VALUES_BY_PROSPECT_ID: "SELECT * FROM <tableName> WHERE prospect_id=<prospect_id>"   
}

const TBL_INTENT_QUERY = {
    RECORD_COUNT: "SELECT COUNT(*) as RECORD_COUNT FROM <tableName> WHERE prospect_id=<prospectId>",
    GET_MAX_INTENT_ID: "SELECT MAX(CAST(SUBSTRING(intent_id,4,len(intent_id)) as int))as MAXINTENTID from <tableName>",
    INSERT_INTENT: "INSERT INTO <tableName> (intent_id,prospect_id,intent_questionaire_payload,active_from) values  ('<intent_id>',<prospect_id>,'<intent_questionaire_payload>',CAST('<active_from>' as datetime))",
    GET_INTENT_BY_INTENTID: "SELECT * from <tableName> WHERE prospect_id=<prospectId> and intent_id='<intentId>'",
    GET_ACTIVE_INTENT_BY_PROSPECTID: "SELECT * from <tableName> WHERE prospect_id=<prospectId> and active_to is NULL",
    IS_INTENT_ACTIVE: "SELECT COUNT(*) as ACTIVE_INTENT_COUNT from <tableName> WHERE prospect_id=<prospectId> and intent_id='<intentId>' and active_to is NULL",
    UPDATE_ACTIVETO: "UPDATE <tableName> SET active_to=GETDATE() WHERE prospect_id=<prospectId> and active_to is NULL"
}

const TBL_PROSPECT_INFORMATION_QUERY = {
    GET_PROSPECT_INFORMATION_BY_PROSPECTID: "SELECT * FROM <tableName> WHERE prospect_id=<prospectId> and active_to is NULL",
    GET_PROSPECT_INFORMATION_BY_PROSPECTID_AND_PAYLOAD_IDENTIFIER: "SELECT * FROM <tableName> WHERE prospect_id=<prospectId> AND payload_identifier='<payloadIdentifier>' and active_to is NULL",
    GET_PROSPECT_INFORMATION_BY_PROSPECTID_AND_PAYLOAD_IDENTIFIER_AND_PAYLOADID: "SELECT * FROM <tableName> WHERE prospect_id=<prospectId> AND payload_identifier='<payloadIdentifier>' and payload_id='<payloadId>' and active_to is NULL",
    RECORD_COUNT: "SELECT COUNT(*) as RECORD_COUNT FROM <tableName> WHERE prospect_id=<prospectId>",
    INSERT_PROSPECT_INFORMATION: "INSERT INTO <tableName> (payload_id,prospect_id,payload_identifier,payload_body,active_from) values  ('<payload_id>',<prospect_id>,'<payload_identifier>','<payload_body>',CAST('<active_from>' as datetime))",
    UPDATE_ACTIVETO: "UPDATE <tableName> SET active_to=GETDATE() WHERE prospect_id=<prospectId> and active_to is NULL",
    IS_PROSPECT_INFO_ACTIVE: "SELECT COUNT(*) as ACTIVE_PROSPECT_INFO_COUNT from <tableName> WHERE prospect_id=<prospectId> and active_to is NULL",
    GET_MAX_PAYLOAD_ID: "SELECT MAX(CAST(SUBSTRING(payload_id,3,len(payload_id)) as int))as MAXPAYLOADID from <tableName>"

}

// exporting modules, to be used in the other .js files
module.exports = { TBL_PROSPECT_QUERY, TBL_PROSPECT_IDENTIFIER_QUERY, TBL_INTENT_QUERY, TBL_PROSPECT_INFORMATION_QUERY }