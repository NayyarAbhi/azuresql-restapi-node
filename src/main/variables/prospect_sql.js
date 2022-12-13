const QUERY = {
    RECORD_COUNT: "SELECT COUNT(*) as RECORD_COUNT FROM <tableName> WHERE ProspectId=<prospectId>",
    UPDATE_ACTIVETO: "UPDATE <tableName> SET ActiveTo=GETDATE() WHERE ProspectId=<prospectId> and IdentifierType in (<identifierTypeList>) and ActiveTo is NULL",
    ADD_PROSP_IDENTIFIER: "INSERT INTO <tableName> (ProspectIdentifierId, ProspectId, Identifier, IdentifierType, ActiveFrom) VALUES <insertVals>",
    INSERT_VALS: "('<prospectIdentifierId>',<prospectId>,'<identifier>','<identifierType>', CAST('<activeFrom>' as datetime))",
    INSERTPROSPECT: "INSERT INTO <tableName> (prospectId,first_name,createdOn,brandIdentifier,channelIdentifier) values  (<prospectId>,'<first_name>',CAST('<createdOn>' as datetime),'<brandIdentifier>','<channelIdentifier>')",
    INSERTPROSPECTIDENTIFIERS: "INSERT INTO <tableName> (prospectIdentifierId,uniqueId,prospectId,identifier,identifierType,activeFrom,activeTo) values ('<prospectIdentifierId>',<uniqueId>,<prospectId>,'<identifier>','<identifierType>','<activeFrom>','<activeTo>')"
}

// exporting modules, to be used in the other .js files
module.exports = { QUERY }