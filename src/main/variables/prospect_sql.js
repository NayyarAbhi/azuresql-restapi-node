const QUERY = {
    RECORD_COUNT: "SELECT COUNT(*) as RECORD_COUNT FROM <tableName> WHERE ProspectId=<prospectId>",
    SELECT: "SELECT * FROM <tableName> WHERE CustomerId='<customerId>'",
    UPDATE: "UPDATE <tableName> SET ActiveTo=GETDATE() WHERE ProspectId='<prospectId>' and IdentifierType='Session'",
    INSERT: "INSERT INTO <tableName> (ProspectIdentifierId, ProspectId, Identifier, IdentifierType, ActiveFrom) values (<prospectIdentifierId>,'<prospectId>','<identifier>','<identifierType>', CAST('<activeFrom>' as datetime))"
}

// exporting modules, to be used in the other .js files
module.exports = { QUERY }
