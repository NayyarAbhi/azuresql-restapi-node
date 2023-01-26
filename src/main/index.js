const HTTP = require('./variables/status.js').HTTP;
const app = require('./app.js');
const env = require('./config/envconfig').env;

const port = env.APP_PORT;

app.listen(port, () => {
    console.log(`Server running on port:${port}`);
});

app.get('/ready', (req, res) => res.status(HTTP.OK.code).json({ message: 'Appilcation Ready to use' }));
app.get('/live', (req, res) => res.status(HTTP.OK.code).json({ message: 'Appilcation is live' }));
app.get('/health', (req, res) => res.status(HTTP.OK.code).json({ message: 'Appilcation is up and running' }));

// generic request
app.get(env.APP_ENTRY_POINT, (req, res) => res.status(HTTP.OK.code).json({ message: 'valid request' }));