const domus_cookie = require('../../variables/domus_cookie_response.json');
const { get } = require('axios');
const env = require('../../config/envconfig').env;

async function getStubResponse(url, x_auth) {
    let stubResponse = '';
    try {
        stubResponse = (await get(url)).data;
    } catch (err) {
        console.log("error: not able to connect to domus cookie stub with url:" + url);
        console.trace(err);
    }
    return stubResponse;
}

async function getActualResponse(url, x_auth) {
    let stubResponse = '';
    return stubResponse;
}

async function getResponsePayload(x_auth) {
    let response_payload = '';
    console.log("Domus Cookie Env is: " + process.env.ENV)

    switch (env) {
        case 'LOCAL':
            response_payload = getStubResponse(env.DOMUSCOOKIE_STUB_URL, x_auth);
            break;
        case 'APPDEV':
            response_payload = getStubResponse(env.DOMUSCOOKIE_STUB_URL, x_auth);
            break;
        case 'INTEGRATION':
            response_payload = getActualResponse(env.DOMUSCOOKIE_URL, x_auth);
            break;
        default:
            console.log('default')
            response_payload = domus_cookie;
    }

    return response_payload;
}


// exporting modules, to be used in the api router
module.exports = { getResponsePayload }