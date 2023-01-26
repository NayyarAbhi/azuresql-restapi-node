const env_config = require('../../config/envconfig.js').environment;

function port() {
    let app_port = '';
    let env = process.env.ENV;
    console.log("app_port env is: " + env)

    switch (env) {
        case 'LOCAL':
            app_port = env_config.LOCAL.APP_PORT;
            break;
        case 'APPDEV':
            app_port = env_config.APPDEV.APP_PORT;
            break;
        case 'INTEGRATION':
            app_port = env_config.INTEGRATION.APP_PORT;
            break;
        default:
            console.log({'error': `${env} env not supported`});
    }
    return app_port;
}

function entryPoint() {
    let app_entry_point = '';
    let env = process.env.ENV;
    console.log("APP_ENTRY_POINT env is: " + env)

    switch (env) {
        case 'LOCAL':
            app_entry_point = env_config.LOCAL.APP_ENTRY_POINT;
            break;
        case 'APPDEV':
            app_entry_point = env_config.APPDEV.APP_ENTRY_POINT;
            break;
        case 'INTEGRATION':
            app_entry_point = env_config.INTEGRATION.APP_ENTRY_POINT;
            break;
        default:
            console.log({'error': `${env} env not supported`});
    }
    return app_entry_point;
}

function version() {
    let app_version = '';
    let env = process.env.ENV;
    console.log("app_version env is: " + env)

    switch (env) {
        case 'LOCAL':
            app_version = env_config.LOCAL.APP_VERSION;
            break;
        case 'APPDEV':
            app_version = env_config.APPDEV.APP_VERSION;
            break;
        case 'INTEGRATION':
            app_version = env_config.INTEGRATION.APP_VERSION;
            break;
        default:
            console.log({'error': `${env} env not supported`});
    }
    return app_version;
}


// exporting modules
module.exports = { port, entryPoint, version }