const QUERY = {
    COUNT: "SELECT COUNT(*) as RECORD_COUNT FROM <tableName> WHERE CustomerId='<customerId>'",
    GETPROSPECTID: "SELECT max(ProspectId) as MAX_PROSPECTID from <tableName>",
    SELECT: "SELECT * FROM <tableName> WHERE CustomerId='<customerId>'",
    UPDATE: "UPDATE <tableName> SET <update_fields> WHERE CustomerId='<customerId>'",
    INSERT: "INSERT INTO <tableName> (ProspectId,Cookie,SessionId,OtpEmailId,DomusCookieId,CustomerId,IBLogon) values (<prospectId>,'<cookie>','<sessionId>','<otpEmailId>','<domusCookieId>',<customerId>,'<iBLogon>')"
}

// exporting modules, to be used in the other .js files
module.exports = { QUERY }
