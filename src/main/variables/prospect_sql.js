const QUERY = {
    COUNT: "SELECT COUNT(*) as RECORD_COUNT FROM <tableName> WHERE CustomerId='<customerId>'",
    SELECT: "SELECT * FROM <tableName> WHERE CustomerId='<customerId>'",
    UPDATE: "UPDATE <tableName> SET Cookie='<cookie>', SessionId='<sessionId>', OtpEmailId='<otpEmailId>', DomusCookieId='<domusCookieId>', IBLogon='<iBLogon>' WHERE CustomerId='<customerId>'",
    INSERT: "INSERT INTO <tableName> (ProspectId,Cookie,SessionId,OtpEmailId,DomusCookieId,CustomerId,IBLogon) values (<prospectId>,<cookie>,<sessionId>,<otpEmailId>,<domusCookieId>,<customerId>,<iBLogon>)"
}

// exporting modules, to be used in the other .js files
module.exports = { QUERY }