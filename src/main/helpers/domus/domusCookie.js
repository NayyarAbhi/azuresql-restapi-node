const domus_cookie = require('../../variables/domus_cookie_response.json');
const { get } = require('axios');
const env_config = require('../../../../config/test-module/environment.js').environment;

async function getStubResponse(url) {
    let stubResponse = '';
    try {
        stubResponse = (await get(url)).data;
    } catch (err) {
        console.log("error: not able to connect to domus cookie stub with url:" + url);
        console.trace(err); 
    }
    return stubResponse;
}

async function getResponsePayload() {
    let response_payload = '';
    let env = process.env.ENV;
    console.log("Env is: " + env)

    switch (env) {
        case 'LOCAL':
            response_payload = getStubResponse(env_config.LOCAL.DOMUSCOOKIE_STUB_URL);
            break;
        case 'APPDEV':
            response_payload = getStubResponse(env_config.APPDEV.DOMUSCOOKIE_STUB_URL);
            break;
        default:
            console.log('default')
            response_payload = domus_cookie;
    }
    
    return response_payload;
}


// exporting modules, to be used in the api router
module.exports = { getResponsePayload }