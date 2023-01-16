const dbService = require('../helpers/prospect-record/prospect_identifier_helper.js');

async function validateCookie(userType,sub) {
    //TO-DO needs to be integrated with Domus Cookie /validate api to get the session id, and read the value from "sub". For now mocked sub.
    //var X_Auth_ID = req.headers['x-authrization-id']; 
    // invoke /validate(X_Auth_ID.json as body)
    //var cookie = X_Auth_Find[1].sub;
    var usertype = userType
    var headerProspectId;
    if (usertype === 'UNAUTH_CUSTOMER') {
        headerProspectId = await dbService.getProspectWithSessionId(sub)
    } else if (usertype === 'IB_CUSTOMER') {
        headerProspectId = await dbService.getProspectWithIBID(sub)
    }
    return headerProspectId;
}

// exporting modules, to be used in the other .js files
module.exports = {validateCookie };