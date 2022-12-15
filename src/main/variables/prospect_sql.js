const QUERY = {
    RECORD_COUNT: "SELECT COUNT(*) as RECORD_COUNT FROM <tableName> WHERE ProspectId=<prospectId>",
    UPDATE_ACTIVETO: "UPDATE <tableName> SET ActiveTo=GETDATE() WHERE ProspectId=<prospectId> and IdentifierType in (<identifierTypeList>) and ActiveTo is NULL",
    ADD_PROSP_IDENTIFIER: "INSERT INTO <tableName> (ProspectIdentifierId, ProspectId, Identifier, IdentifierType, ActiveFrom) VALUES <insertVals>",
    INSERT_VALS: "('<prospectIdentifierId>',<prospectId>,'<identifier>','<identifierType>', CAST('<activeFrom>' as datetime))",
    INSERT_PROSPECT: "INSERT INTO <tableName> (prospect_id,created_on,brand_identifier,channel_identifier,first_name) values  (<prospect_id>,CAST('<created_on>' as datetime),'<brand_identifier>','<channel_identifier>','<first_name>')",
    INSERT_PROSPECT_IDENTIFIERS: "INSERT INTO <tableName> (prospect_identifier_id,prospect_id,identifier,identifier_type,active_from) values ('<prospect_identifier_id>',<prospect_id>,'<identifier>','<identifier_type>',GETDATE())",
    PROSPECT_VALUES_BY_PROSPECT_ID: "SELECT *  FROM <tableName> WHERE prospect_id=<prospect_id>",
    PROSPECT_IDENTIFIER_VALUES_BY_PROSPECT_ID: "SELECT * FROM <tableName> WHERE prospect_id=<prospect_id>",
    PROSPECT_IDENTIFIER_VALUES_BY_IDENTIFIER_TYPE_AND_VALUE: "SELECT * FROM <tableName> WHERE identifier_type='<IdentifierType>' and identifier='<IdentifierValue>'",
    GET_PROSPECT_WITH_SESSION_ID_OR_IBID:"SELECT prospect_id as PROSPECT_ID from <tableName> WHERE identifier='<identifier>'",
    GET_PROSPECT_ID: "SELECT max(prospect_id) as MAXPROSPECTID from <tableName>",
    GET_PROSPECT_IDENTIFIER_ID:"SELECT MAX(CAST(SUBSTRING(prospect_identifier_id,4,len(prospect_identifier_id)) as int))as MAXPROSPECTIDENTIFIERID from <tableName>",
    GET_PROSPECT_WITH_SESSION_ID:"SELECT prospect_id from <tableName> WHERE identifier='<identifier>' and identifier_type='SessionId'",
    GET_PROSPECT_WITH_IBID:"SELECT prospect_id from <tableName> WHERE identifier='<identifier>' and identifier_type='IBID'" 
}

// exporting modules, to be used in the other .js files
module.exports = { QUERY }