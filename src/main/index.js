const HTTP = require('./variables/status.js').HTTP;
const app = require('./app.js');

const port = 8001;
//const host = '0.0.0.0';
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(port, () => {
    console.log(`Server running on port:${port}`);
});
app.get('/readiness', (req,res) => res.status(HTTP.OK.code).json({message : 'Appilcation Ready to use'}));
app.get('/liveness', (req,res) => res.status(HTTP.OK.code).json({message : 'Appilcation is live'}));
app.get('/health', (req,res) => res.status(HTTP.OK.code).json({message : 'Appilcation is up and running'}));
//prospect api entry point
app.use('/api/v1/prospect',
    prospect_route.prospectRoutes,
    intent_route.intentRoutes,
    prospect_information_route.prospectInformationRoutes

);

// unknown request
app.get('*', (req, res) => res.status(HTTP.BAD_REQUEST.code).json({ message: 'not a valid request' }));
