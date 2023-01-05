const HTTP = require('../variables/status.js').HTTP;
const validator = require('../validator/prospectIntentValidator');
const FIND_HELPER = require('../helpers/prospect-intent/find_helper.js');
const CREATE_HELPER = require('../helpers/prospect-intent/create_helper');
let X_Auth = require('../variables/x-authorisation.json');
let X_Auth_Find = require('../variables/x-auth-id-find.json');