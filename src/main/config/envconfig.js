let environment = {
    LOCAL: {
        APP_PORT: '8085',
        APP_ENTRY_POINT: '/dataapi/prospect/',
        APP_VERSION: 'v1',
        DOMUSCOOKIE_STUB_URL: 'http://localhost:3000/domuscookie'
    },
    APPDEV: {
        APP_PORT: '8085',
        APP_ENTRY_POINT: '/dataapi/prospect/',
        APP_VERSION: 'v1',
        DOMUSCOOKIE_STUB_URL: 'http://http://prospect-management-ms-stub:3000/domuscookie'
    },
    INTEGRATION: {
        APP_PORT: '8085',
        APP_ENTRY_POINT: '/dataapi/prospect/',
        APP_VERSION: 'v1',
        DOMUSCOOKIE_STUB_URL: 'http://0.0.0.0:3000/domuscookie'
    }
}

module.exports = { environment }