const domus_cookie = require('../../variables/domus_cookie_response.json');
const { post } = require('axios');
const env = require('../../config/envconfig').env;

async function getStubResponse(url, x_auth) {
    let stubResponse = '';
    try {
        stubResponse = (await post(url, JSON.parse(x_auth))).data;
    } catch (err) {
        console.log("error: not able to connect to domus cookie stub with url:" + url);
        console.trace(err);
    }
    return stubResponse;
}

async function getActualResponse(url, x_auth) {
    let response = '';
    try {
        response = (await post(url, x_auth)).data;
    } catch (err) {
        console.log("error: not able to connect to domus cookie with url:" + url);
        console.trace(err);
    }
    return response;
}

async function getResponsePayload(x_auth) {
    let response_payload = '';
    console.log("Domus Cookie Env is: " + process.env.ENV)

    switch (process.env.ENV) {
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
            console.log(`error: env ${env} not valid for getting domus cookie response`);
    }

    return response_payload;
}


// exporting modules, to be used in the api router
module.exports = { getResponsePayload }