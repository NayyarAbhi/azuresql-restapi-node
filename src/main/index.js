const HTTP = require('./variables/status.js').HTTP;
const app = require('./app.js');
const env = require('./config/envconfig').env;

const port = env.APP_PORT;

app.listen(env.APP_PORT, () => {
    console.log(`Server running on port:${port}`);
});

app.get('/ready', (req, res) => res.status(HTTP.OK.code).json({ message: 'Appilcation Ready to use' }));
app.get('/live', (req, res) => res.status(HTTP.OK.code).json({ message: 'Appilcation is live' }));
app.get('/health', (req, res) => res.status(HTTP.OK.code).json({ message: 'Appilcation is up and running' }));

// unknown request
app.get('*', (req, res) => res.status(HTTP.BAD_REQUEST.code).json({ message: 'not a valid request' }));
