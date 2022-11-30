const QUERY = {
    SELECT: 'SELECT * FROM <tableName> WHERE ProspectId = <val>',
    INSERT: 'INSERT INTO prospectdetails (ProspectId,Cookie,SessionId,OtpEmailId,DomusCookieId,CustomerId,IBLogon) values (?,?,?,?,?)'
}

// exporting modules, to be used in the other .js files
module.exports = {QUERY}