const QUERY = {
    FIND_VALID_PROSPECT_AND_ASSOCIATED_IDENTIFIER : "select top 1 a.prospect_id as 'prospect_ID', b.identifier as 'identifier' from dbo.[prospect.tbl_prospect] a Inner JOIN dbo.[prospect.tbl_prospect_identifiers] b on a.prospect_id = b.prospect_id where b.identifier_type = '<SessionId>' ORDER BY NEWID()",
    FIND_VALID_PROSPECT_IDENTIFIER_FOR_PROSPECT : "select top 1 b.identifier as 'IdentifierValue', b.identifier_type as 'IdentifierType' from dbo.[prospect.tbl_prospect_identifiers] b where b.prospect_id = <prospect_id> ORDER by NEWID()",
    FIND_VALID_PROSPECT_IDENTIFIER_FOR_ANY_OTHER_PROSPECT : "select top 1 b.prospect_id as 'PorspectID', b.identifier as 'IdentifierValue', b.identifier_type as 'IdentifierType' from dbo.[prospect.tbl_prospect_identifiers] b where b.prospect_id not in ( <prospect_id> ) ORDER by NEWID()",
    SELECT_PROSPECT : "SELECT *  FROM  dbo.[prospect.tbl_prospect] WHERE prospect_id=<prospect_id>",
    SELECT_PROSPECT_IDENTIFIER: "SELECT * FROM dbo.[prospect.tbl_prospect_identifiers] WHERE prospect_id=<prospect_id>",
    SELECT_PROSPECT_IDENTIFIER_BY_TYPE_AND_VALUE : "SELECT * FROM dbo.[prospect.tbl_prospect_identifiers] WHERE prospect_id=<prospect_id> and identifier_type = '<identifierType>' and identifier = '<identifierValue>'",
    FIND_PROSPECT_NOT_IN_PROSPECT_IDENTIFIER : "select top 1 prospect_id from dbo.[prospect.tbl_prospect] where prospect_id not in (select prospect_id from dbo.[prospect.tbl_prospect_identifiers]) ORDER BY NEWID()",
    FIND_ANY_PROSPECT_IDENTIFIER : "select top 1 prospect_id, identifier from dbo.[prospect.tbl_prospect_identifiers] ORDER BY NEWID()",
}

// exporting modules, to be used in the other .js files
module.exports = { QUERY }