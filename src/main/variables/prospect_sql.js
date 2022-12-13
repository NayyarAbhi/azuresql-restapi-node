const QUERY = {
    RECORD_COUNT: "SELECT COUNT(*) as RECORD_COUNT FROM <tableName> WHERE ProspectId=<prospectId>",
    UPDATE_ACTIVETO: "UPDATE <tableName> SET ActiveTo=GETDATE() WHERE ProspectId=<prospectId> and IdentifierType in (<identifierTypeList>) and ActiveTo is NULL",
    ADD_PROSP_IDENTIFIER: "INSERT INTO <tableName> (ProspectIdentifierId, ProspectId, Identifier, IdentifierType, ActiveFrom) VALUES <insertVals>",
    INSERT_VALS: "('<prospectIdentifierId>',<prospectId>,'<identifier>','<identifierType>', CAST('<activeFrom>' as datetime))",
    INSERT_PROSPECT: "INSERT INTO <tableName> (prospectId,first_name,createdOn,brandIdentifier,channelIdentifier) values  (<prospectId>,'<first_name>',CAST('<createdOn>' as datetime),'<brandIdentifier>','<channelIdentifier>')",
    INSERT_PROSPECT_IDENTIFIERS: "INSERT INTO <tableName> (prospectIdentifierId,uniqueId,prospectId,identifier,identifierType,activeFrom,activeTo) values ('<prospectIdentifierId>',<uniqueId>,<prospectId>,'<identifier>','<identifierType>','<activeFrom>','<activeTo>')",
    PROSPECT_VALUES_BY_PROSPECT_ID: "SELECT *  FROM <tableName> WHERE prospect_id=<prospect_id>",
    PROSPECT_IDENTIFIER_VALUES_BY_PROSPECT_ID: "SELECT * FROM <tableName> WHERE prospect_id=<prospect_id>",
    PROSPECT_IDENTIFIER_VALUES_BY_IDENTIFIER_TYPE_AND_VALUE: "SELECT * FROM <tableName> WHERE identifier_type='<IdentifierType>' and identifier='<IdentifierValue>'",
    GET_PROSPECT_WITH_SESSION_ID:"SELECT ProspectId as PROSPECT_ID from <tableName> WHERE identifier=<identifier>"
}

// exporting modules, to be used in the other .js files
module.exports = { QUERY }