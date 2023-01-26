let environment = {
    LOCAL: {
        APP_PORT: '8085',
        APP_ENTRY_POINT: '/dataapi/prospect/',
        APP_VERSION: 'v1'
    },
    APPDEV: {
        APP_PORT: '8085',
        APP_ENTRY_POINT: '/dataapi/prospect/',
        APP_VERSION: 'v1'
    },
    INTEGRATION: {
        APP_PORT: '8085',
        APP_ENTRY_POINT: '/dataapi/prospect/',
        APP_VERSION: 'v1'
    }
}

module.exports = { environment }