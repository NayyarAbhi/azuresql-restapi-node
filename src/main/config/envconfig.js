const env_config = {
    LOCAL: {
        APP_PORT: '8085',
        APP_ENTRY_POINT: '/dataapi/prospect/',
        APP_VERSION: 'v1',
        DOMUSCOOKIE_URL: '',
        DOMUSCOOKIE_STUB_URL: 'http://localhost:3000/validate'
    },
    APPDEV: {
        APP_PORT: '8085',
        APP_ENTRY_POINT: '/dataapi/prospect/',
        APP_VERSION: 'v1',
        DOMUSCOOKIE_URL: '',
        DOMUSCOOKIE_STUB_URL: 'http://localhost:3000/validate'
    },
    INTEGRATION: {
        APP_PORT: '8085',
        APP_ENTRY_POINT: '/dataapi/prospect/',
        APP_VERSION: 'v1',
        DOMUSCOOKIE_URL: '',
        DOMUSCOOKIE_STUB_URL: 'http://localhost:3000/validate'
    }
}

const env = env_config[process.env.ENV];

// exporting modules
module.exports = { env }