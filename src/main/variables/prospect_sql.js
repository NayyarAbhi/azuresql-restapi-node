const QUERY = {
    COUNT: "SELECT COUNT(*) as RECORD_COUNT FROM <tableName> WHERE CustomerId='<customerId>'",
    GETPROSPECTID: "SELECT max(ProspectId) as MAX_PROSPECTID from <tableName>",
    GETPROSPECTIDENTIFIERID:"SELECT max(prospectIdentifierId) as MAX_PROSPECTIDENTIFIERID from <tableName>",
    SELECT: "SELECT * FROM <tableName> WHERE CustomerId='<customerId>'",
    UPDATE: "UPDATE <tableName> SET <update_fields> WHERE CustomerId='<customerId>'",
    INSERT: "INSERT INTO <tableName> (ProspectId,Cookie,SessionId,OtpEmailId,DomusCookieId,CustomerId,IBLogon) values (<prospectId>,'<cookie>','<sessionId>','<otpEmailId>','<domusCookieId>',<customerId>,'<iBLogon>')",
    INSERTPROSPECT: "INSERT INTO <tableName> (prospectId,first_name,createdOn,brandIdentifier,channelIdentifier) values  (<prospectId>,'<first_name>',CAST('<createdOn>' as datetime),'<brandIdentifier>','<channelIdentifier>')",
    INSERTPROSPECTIDENTIFIERS: "INSERT INTO <tableName> (prospectIdentifierId,uniqueId,prospectId,identifier,identifierType,activeFrom,activeTo) values ('<prospectIdentifierId>',<uniqueId>,<prospectId>,'<identifier>','<identifierType>','<activeFrom>','<activeTo>')"
}

// exporting modules, to be used in the other .js files
module.exports = { QUERY }