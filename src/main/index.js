const HTTP = require('./variables/status.js').HTTP;
const app = require('./app.js');

const port = 8001

app.listen(port, () => {
    console.log(`Server running on port:${port}`);
});

app.get('/readiness', (req, res) => res.status(HTTP.OK.code).json({ message: 'Appilcation Ready to use' }));
app.get('/liveness', (req, res) => res.status(HTTP.OK.code).json({ message: 'Appilcation is live' }));
app.get('/health', (req, res) => res.status(HTTP.OK.code).json({ message: 'Appilcation is up and running' }));

// unknown request
app.get('*', (req, res) => res.status(HTTP.BAD_REQUEST.code).json({ message: 'not a valid request' }));
