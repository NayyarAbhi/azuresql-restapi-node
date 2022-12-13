const QUERY = {
    RECORD_COUNT: "SELECT COUNT(*) as RECORD_COUNT FROM <tableName> WHERE ProspectId=<prospectId>",
    UPDATE_ACTIVETO: "UPDATE <tableName> SET ActiveTo=GETDATE() WHERE ProspectId=<prospectId> and IdentifierType in (<identifierTypeList>) and ActiveTo is NULL",
    ADD_PROSP_IDENTIFIER: "INSERT INTO <tableName> (ProspectIdentifierId, ProspectId, Identifier, IdentifierType, ActiveFrom) VALUES <insertVals>",
    INSERT_VALS: "('<prospectIdentifierId>',<prospectId>,'<identifier>','<identifierType>', CAST('<activeFrom>' as datetime))"
}

// exporting modules, to be used in the other .js files
module.exports = { QUERY }
