const domus_cookie = require('../../variables/domus_cookie_response.json');
const { get } = require('axios');
const env_config = require('../../../../config/test-module/environment.js').environment;

const ENV = 'LOCAL';

async function getResponsePayload() {
    let response_payload = '';
    let mockResponse = '';

    switch (ENV) {
        case 'LOCAL':
            mockResponse = await get(env_config.LOCAL.DOMUSCOOKIE_STUB_URL);
            response_payload = mockResponse.data;
            break;
        case 'APPDEV':
            mockResponse = await get(env_config.APPDEV.DOMUSCOOKIE_STUB_URL);
            response_payload = mockResponse.data;
            break;
        case 'INTEGRATION':
            mockResponse = await get(env_config.INTEGRATION.DOMUSCOOKIE_STUB_URL);
            response_payload = mockResponse.data;
            break;
        default:
            console.log('default')
            response_payload = domus_cookie;
    }

    return response_payload;
}


// exporting modules, to be used in the api router
module.exports = { getResponsePayload }