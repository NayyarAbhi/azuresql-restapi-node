const env_config = {
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

const env = env_config[process.env.ENV];

// exporting modules
module.exports = { env }