let environment = {
    LOCAL: {
        DOMUSCOOKIE_STUB_URL: 'http://localhost:3000/domuscookie',
    },
    APPDEV: {
        LLOYDS: {
            PROSPECT_MS_URL: 'http://localhost:8000',
            PROSPECT_MS_ENDPOINTS: {
                createProspect: '/',
                findProspectwithID:'/',
                findProspect : '/find',
                addProspect : '/',
                health: '',
            }
        },
        DOMUSCOOKIE_STUB_URL: 'http://localhost:8085/domuscookie',
    },
    INTEGRATION: {
        LLOYDS: {
            PROSPECT_MS_URL: 'http://localhost:8000',
            PROSPECT_MS_ENDPOINTS: {
                createProspect: '/',
                findProspectwithID:'/',
                findProspect : '/find',
                addProspect : '/',
                health: '',
            }
        },
        DOMUSCOOKIE_STUB_URL: 'http://0.0.0.0:3000/domuscookie',
    },
}

module.exports = {
    environment,
}