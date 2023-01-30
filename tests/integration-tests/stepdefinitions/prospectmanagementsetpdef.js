//const fs = require('fs');
//const path = require('path');
const { Given, Then, When, Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const {setDefaultTimeout} = require('@cucumber/cucumber');
const RequestHandler = require('@lbg/mortgages-automation/dist/api/libraries/requestHandler').default;
const environmentData = require('../../../config/test-module/environment').environment;
const ENV_DATA = environmentData[process.env.ENV];

//const dbConnectionHelper = require('../helper/database/DBConnectionHelper')
//const testDataFromDBHelper = require('../helper/database/TestDataFromDBHelper')
//const domus_cookie_validator_moc  = require('../helper/mocresponse/authdomuscookieresponse'); 

const { faker } = require('@faker-js/faker')
const { expect } = require('chai');

const stepDefOperations = require('../helper/operations/stepdefinationhelper')


//Variables created
//request handler from framework
let requestHandler;

//local variables from this test
let created_on = null
let brand_identifier = null
let channel_identifier = null
let first_name = null
let phone = [];
let email = [];
let mobile = [];
let active_from = [];
let active_from_intent = [];
let identifier = 1234
let header
let test_data_body = null
let prospectIDCreated = 1234
let intentIDCreated = 1234
let intentQuestionaiarPayload = []

let isBackgroundExecuted = false



//Hooks

//conneciton to DB is not requried

/*BeforeAll({ timeout: 30000 }, async () => {
    //connect to the Data Base
    try {
        await dbConnectionHelper.setConnection();
    } catch (exp) {
        console.log("could not connect to DB server");
        console.log(exp)
    }
});

AfterAll(async () => {
    //close connection to the Data Base
    try {
        await dbConnectionHelper.closeConnection();
    } catch (exp) {
        console.log("could not close connection to DB server");
        console.log(exp)
    }
});
*/
BeforeAll({ timeout: 30000 }, async () => {
    setDefaultTimeout(30000);
    console.log("############### START OF EXECUTION ###############################")
});

AfterAll({ timeout: 30000 }, async () => {
    console.log("############### END OF EXECUTION #################################")
});

Before({ timeout: 3000 }, async (scenario) => {
    console.log("############### START OF TEST CASE ###############################")
    console.log(`Executiong test case :- ${scenario.pickle.name}`)
    requestHandler = new RequestHandler();
    global.requestHandler = requestHandler;

    //create test data
    created_on = new Date(Date.now());
    brand_identifier = faker.company.name();
    channel_identifier = faker.company.companySuffix();
    first_name = faker.name.firstName();
    identifier = faker.datatype.number({ min: 1000, max: 10000000 }).toString();
});

After(async () => {
    requestHandler.reset();
    console.log("############### END OF TEST CASE ################################")
});


Given('Test data for {string} is created as {string}', async function (serviceName, test_data) {
    //create the test data
    
    try {
        if (serviceName === 'create prospect') {
            const test_data_body_create = {
                "created_on": created_on,
                "brand_identifier": brand_identifier,
                "channel_identifier": channel_identifier,
                "first_name": first_name
            }
            //set the values of non mandatory fields if not requried to blank
            if(test_data === 'new recored with only mandatory fields'){
                first_name = '';
                channel_identifier = '';
            }
            if(test_data === 'new recored without first_name'){
                first_name = '';
            }
            if(test_data === 'new record without channel_identifier'){
                channel_identifier = '';
            }
            
            try {
                test_data_body = stepDefOperations.createTestData(serviceName, test_data, test_data_body_create)
            } catch (err) {
                expect.fail(err);
            }
        } else if (['add prospect contact using prospect id', 'add prospect contact'].includes(serviceName)) {
            //create new value of phone, email, mobile and active_from
            phone.push(faker.phone.number());
            email.push(faker.internet.email());
            mobile.push(faker.phone.number());
            active_from.push(new Date(Date.now()));
            if(!['update prospect identifier only'].includes(test_data)){ 
                first_name = faker.name.firstName();
                channel_identifier = faker.company.companySuffix();
                brand_identifier = faker.company.name();
            }
            //full body
            const test_data_body_add_update_prospect = {
                'first_name' : first_name,
                'channel_identifier' : channel_identifier,
                'brand_identifier' : brand_identifier,
                'phone' : phone[phone.length-1],
                'email' : email[email.length-1],
                'mobile' : mobile[mobile.length-1],
                'active_from' : active_from[active_from.length-1],
            }
            try {
                test_data_body = stepDefOperations.createTestData(serviceName, test_data, test_data_body_add_update_prospect)
            } catch (err) {
                expect.fail(err);
            }
        } else if(serviceName === 'find prospect'){
            
            if(test_data === 'session id'){
                test_data_body = {
                        'IdentifierType': "SessionId",
                        'IdentifierValue': identifier
                }
            }else if(test_data === 'new phone'){
                test_data_body = {
                        'IdentifierType': "phone",
                        'IdentifierValue': phone[phone.length - 1]
                }
            }else if(test_data === 'old phone'){
                test_data_body = {
                        'IdentifierType': "phone",
                        'IdentifierValue': phone[phone.length - 2]
                }
            }else if(test_data === 'new mobile'){
                test_data_body = {
                        'IdentifierType': "mobile",
                        'IdentifierValue': mobile[mobile.length - 1]
                }
            }else if(test_data === 'old mobile'){
                test_data_body = {
                        'IdentifierType': "mobile",
                        'IdentifierValue': mobile[mobile.length - 2]
                }
            }else if(test_data === 'new email'){
                test_data_body = {
                        'IdentifierType': "email",
                        'IdentifierValue': email[email.length - 1]
                }
            }else if(test_data === 'old email'){
                test_data_body = {
                        'IdentifierType': "email",
                        'IdentifierValue': email[email.length - 2]
                }
            }else if(test_data === 'Invalid-request-wrong-values'){
                test_data_body = {
                        'IdentifierType': "email",
                        'IdentifierValue': "wrong_email@gmail.com"
                }
            }else if(test_data === 'IdentifierType not sent in request'){
                test_data_body = {
                        'IdentifierValue': "wrong_email@gmail.com"
                }
            }else if(test_data === 'IdentifierType is not a string'){
                test_data_body = {
                    'IdentifierType': 1234,
                    'IdentifierValue': "wrong_email@gmail.com"
                }
            }else if(test_data === 'IdentifierValue not sent in request'){
                test_data_body = {
                    'IdentifierType': "email"
                }
            }else if(test_data === 'IdentifierValue is not a string'){
                test_data_body = {
                    'IdentifierType': "email",
                    'IdentifierValue': 1234
                }
            }else if(test_data === 'Empty Request Body'){
                test_data_body = {}
            }else if(test_data === 'Values not sent as String'){
                test_data_body = {
                    'IdentifierType': 1234,
                    'IdentifierValue': 1234
                }
            }else if(test_data === 'invalid value of x-authorization-id'){
                test_data_body = {
                    'IdentifierType': "SessionId",
                    'IdentifierValue': identifier
                }
            }else if(test_data === 'x-auth-value is not valid'){
                test_data_body = {
                        'IdentifierType': "SessionId",
                        'IdentifierValue': identifier
                }
            }else{
                expect.fail(`Test data for find ${test_data} is not defined`);
            }
        }else {
            expect.fail(`service name ${serviceName} is not defined`);
        }
        console.log("Test Data created - ");
        console.log(test_data_body);
        console.log(`identifer = ${identifier}`);
    } catch (err) {
        console.trace(err);
        expect.fail(err);
    }
});


When('New {string} is created as follows for {string}', async function(serviceName, test_data, dataTable){
    try{
        if(['intent'].includes(serviceName)){
            //create an intent payload
            let data_from_table = {};
            dataTable.raw().forEach(function(raw) {
                if(raw[0] !== 'field'){
                    data_from_table[raw[0]] = raw[1]
                } 
            });
            active_from_intent.push(new Date(Date.now()));
            intentQuestionaiarPayload.push(data_from_table)
            test_data_body = {
                'intent_questionaire_payload' : intentQuestionaiarPayload[intentQuestionaiarPayload.length-1],
                'active_from' : active_from_intent[active_from_intent.length - 1]
            }
        }else{
            throw `service ${serviceName} is not defined`
        }
        if(test_data === 'valid scenario'){
            console.log('valid scenairo - test data created successfully');
        }else if(test_data === 'without intent_questionaire_payload'){
            delete test_data_body.intent_questionaire_payload
        }else if(test_data === 'without active_from'){
            delete test_data_body.active_from
        }else if(test_data === 'active_from not as a valid string'){
            test_data_body.active_from = '2023-01-44T12:26:06.521Z'
        }else if(test_data === 'active_from is a number'){
            test_data_body.active_from = 1234
        }else if(test_data === 'intent_questionaire_payload is a number'){
            test_data_body.intent_questionaire_payload = 1234
        }else if(test_data === 'intent_questionaire_payload is a string'){
            test_data_body.intent_questionaire_payload = "1234"
        }else if(test_data ==='invalid value of x-authorization-id'){
            //do nothing
            console.log('invalid value of x-authorization-id - test data created successfully');
        }else{
            throw `test data is not defined - ${test_data}`
        }
        console.log("Intent paylod created - ")
        console.log(test_data_body);
    }catch(err){
        console.trace(err);
    }
} );



Given('The header values are set with user as {string}', async function (user_type) {
    //Set MOC values to be used by the DEV COCE
    // MOC values will only be set for LOCAL and DEV environments

    header = `{"userType": ${user_type}, "sub":  ${identifier}, "exp": 1666343413, "userAgent": "Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1" }`

    console.log(header)

    
    /*if (['LOCAL', 'APPDEV'].includes(process.env.ENV)) {
        //setting the moc with the stub
        try {
            const BRAND = process.env.BRAND
            url = ENV_DATA.DOMUSCOOKIE_STUB_URL;
            await requestHandler.setEndpoint(url);
            await requestHandler.setVerb('POST');

            let moc_body;
            if (user_type === 'UNAUTH Customer') {
                moc_body = {
                    "id": 1,
                    "userType": "UNAUTH_CUSTOMER",
                    "sub": identifier,
                    "exp": 1666343413
                }
            } else if (user_type === 'IB CUSTOMER') {
                moc_body = {
                    "id": 1,
                    "userType": "IB_CUSTOMER",
                    "sub": identifier,
                    "exp": 1666343413
                }
            } else {
                moc_body = {
                    "id": 1,
                    "userType": user_type,
                    "sub": identifier,
                    "exp": 1666343413
                }
            }
            await requestHandler.setBodyJson(moc_body)
            await requestHandler.sendRequest();
            console.log("The MOC is set to return the followign response - from stub service")
            console.log(global.response.data);
        } catch (err) {
            console.trace(err);
            expect.fail(err);
        }
    }
    //call to set up local stub in the project
    try {
        stepDefOperations.setDomusCookieValidatorMOC(user_type, identifier)
    } catch (exp) {
        console.trace(err);
        expect.fail(exp)
    }*/
});

When('A {string} is created', (id) => {
    try {
        if(id === 'prospect id'){
            prospectIDCreated = global.response.data.message.split(" ")[1];
            expect(prospectIDCreated).to.not.be.equal(null);
            console.log(`Prospect ID is created - ${prospectIDCreated}`);
        }else if(id === 'intent id'){
            //capture the intent id
            let regex = /IntentId (.*?) is created successfully/; 
            intentIDCreated = global.response.data.message.match(regex)[1]
            expect(intentIDCreated).to.not.be.equal(null);
            console.log(`Intent ID is created - ${intentIDCreated}`);
        }else{
            throw 'ID not defined'
        }
    } catch (err) {
        console.trace(err);
        expect.fail(err);
    }
});

When('The {string} is updated to an invalid value', async (id_to_update) => {
    try {
        if(id_to_update === 'prospect id'){
            prospectIDCreated = 1234;
            console.log(`Prospect ID is updated to  - ${prospectIDCreated}`);
        }else if(id_to_update === 'intent id'){
            intentIDCreated = 1234;
            console.log(`Intent ID is updated to  - ${prospectIDCreated}`);
        }else{
            throw `In-valid request to update the id ${id_to_update}`
        }
        
    } catch (err) {
        console.trace(err);
        expect.fail(err);
    }
});

When('A {string} request to {string} is executed for {string}', async function (verb, serviceName, test_data) {
    //Create a post request using the framework and execute
    try {
        const BRAND = process.env.BRAND
        url = ENV_DATA[BRAND].PROSPECT_MS_URL;
        let endpoint
        if (serviceName === 'create prospect') {
            endpoint = ENV_DATA[BRAND].PROSPECT_MS_ENDPOINTS.createProspect;
        }else if (serviceName === 'find prospect') {
            endpoint = `${ENV_DATA[BRAND].PROSPECT_MS_ENDPOINTS.findProspect}`;
        }else if (serviceName === 'find prospect using prospect id') {
            endpoint = `${ENV_DATA[BRAND].PROSPECT_MS_ENDPOINTS.findProspectwithID}/${prospectIDCreated}`;
        }else if (serviceName === 'add prospect contact using prospect id') {
            endpoint = `${ENV_DATA[BRAND].PROSPECT_MS_ENDPOINTS.addProspect}/${prospectIDCreated}`;
        }else if (serviceName === 'add prospect contact') {
            endpoint = `${ENV_DATA[BRAND].PROSPECT_MS_ENDPOINTS.addProspect}`;
        }else if (serviceName === 'create intent') {
            endpoint = `${ENV_DATA[BRAND].PROSPECT_MS_ENDPOINTS.createIntent}/${prospectIDCreated}/intent`;
        }else if (serviceName === 'find intent') {
            endpoint = `${ENV_DATA[BRAND].PROSPECT_MS_ENDPOINTS.findIntent}/${prospectIDCreated}/intent`;
        }else if (serviceName === 'find intent by id'){
            // ProspectId/intent/:IntentId
            endpoint = `${ENV_DATA[BRAND].PROSPECT_MS_ENDPOINTS.findIntentwithID}/${prospectIDCreated}/intent/${intentIDCreated}`; 
        }
        else{
            throw `service name ${serviceName} not defined`
        }
        console.log(`Executing the tests on ${url}${endpoint}`);
        await requestHandler.setEndpoint(url + endpoint);
        await requestHandler.setVerb(verb.toUpperCase());
        if(test_data !== 'invalid value of x-authorization-id'){
            await requestHandler.setHeader(`x-authorization-id`, header);
        }
        if (['POST', 'PUT'].includes(verb.toUpperCase())) {
            await requestHandler.setBodyJson(test_data_body)
        }
        await requestHandler.sendRequest();
    } catch (exp) {
        console.log(`scenario failed with exception = ${exp}`)
        console.trace(err);
        expect.fail(exp)
    }
});


Then('Validate the response of {string} for {string} and {string}', async function (serviceName, test_data, user_type) {
    //validate the response
    try {
        stepDefOperations.validateResponse(serviceName, test_data, prospectIDCreated, user_type, identifier);
    } catch (err) {
        console.trace(err);
        expect.fail(err)
    }
});

Then('Make the thread to sleep for {string} seconds', { timeout: 30000 }, async function(timeout_in_seconds){
    try{
        await stepDefOperations.sleep(parseInt(timeout_in_seconds)*1000);
    }catch(err){
        console.trace(err)
        expect.fail(err)
    }
});

Then('Validate the response of {string} for {string} and {string} in DB', async function (serviceName, test_data, user_type) {

    let actual_response_find = global.response;
    //Print response on screen
    console.log("Actual Response of find received is- ");
    console.log(actual_response_find.data)
    console.log("Response status code is ")
    console.log(actual_response_find.status)

    //verify that the response is OK
    expect(actual_response_find.status).to.be.equal(200);

    let data_to_verify = null;
    if (['create prospect','add prospect contact using prospect id', 'add prospect contact', 'find prospect', 'create intent'].includes(serviceName)) {
        data_to_verify = {
            "created_on": created_on,
            "brand_identifier": brand_identifier,
            "channel_identifier": channel_identifier,
            "first_name": first_name,
            "identifier": identifier,
            "prospectIDCreated": prospectIDCreated,
            'phone' : phone,
            'email' : email,
            'mobile' : mobile,
            'active_from' : active_from,
            'active_from_intent' : active_from_intent,
            'intentQuestionaiarPayload' : intentQuestionaiarPayload,
            'intentIDCreated' : intentIDCreated
        }
    }else{
        throw `service - ${serviceName} is not defined`
    }
    try {
        stepDefOperations.validateResponseInDB(serviceName, test_data, user_type, actual_response_find, data_to_verify)
    } catch (err) {
        console.trace(err);
        expect.fail(err)
    }
});

/*
Then('Validate the response for {string} and {string} in DB', async function (test_data, user_type) {
    //validate the response in DB
    try {
        const actual_response = global.response;
        if (test_data === 'existing value of x-authorization-id') {
            //Data should not have been created in DB
            console.log(`step not requried for scenario ${test_data}`)
        } else {
            //validate from the DB
            try {
                const porspect_id_created = parseInt(actual_response.data.message.split(" ")[1]);
                //Create verification object
                let verification_object;
                //get data from DB
                verification_object = await testDataFromDBHelper.getProspectAndProspectIdentifierRecordFromDB(porspect_id_created);
                //validate the values created in DB for the prospect
                //validate prospect
                expect(verification_object.prospect[0].prospect_id).to.be.equal(porspect_id_created);
                //created on
                const actual_created_on = verification_object.prospect[0].created_on.toString();
                const expected_created_on = created_on.toString();
                expect(actual_created_on).to.be.equal(expected_created_on);
                expect(verification_object.prospect[0].brand_identifier).to.be.equal(brand_identifier);
                if(test_data === 'new recored with only mandatory fields'){
                    expect(verification_object.prospect[0].channel_identifier).to.be.equal("");
                    expect(verification_object.prospect[0].first_name).to.be.equal("");
                }else if(test_data === 'new recored without first_name'){
                    expect(verification_object.prospect[0].channel_identifier).to.be.equal(channel_identifier);
                    expect(verification_object.prospect[0].first_name).to.be.equal("");
                }else if (test_data === 'new record without channel_identifier'){
                    expect(verification_object.prospect[0].channel_identifier).to.be.equal("");
                    expect(verification_object.prospect[0].first_name).to.be.equal(first_name);
                }else{
                    expect(verification_object.prospect[0].channel_identifier).to.be.equal(channel_identifier);
                    expect(verification_object.prospect[0].first_name).to.be.equal(first_name);
                }
                //validate prospect identifier
                expect(verification_object.prospect_identifiers[0].prospect_id).to.be.equal(porspect_id_created);
                expect(verification_object.prospect_identifiers[0].identifier).to.be.equal(identifier);
                if(user_type === 'UNAUTH Customer'){
                    expect(verification_object.prospect_identifiers[0].identifier_type).to.be.equal("SessionId");
                }else {
                    expect(verification_object.prospect_identifiers[0].identifier_type).to.be.equal("IBID");
                }
                //active_from
                const active_from_from_db = verification_object.prospect_identifiers[0].active_from.toDateString();
                const current_date = new Date(Date.now()).toDateString();
                expect(active_from_from_db).to.be.equal(current_date);
                expect(verification_object.prospect_identifiers[0].active_to).to.be.equal(null);
                expect(verification_object.prospect_identifiers[0].prospect_identifier_id).to.not.be.equal(null);
            } catch (err) {
                console.log(`scenario failed with exception = ${err}`)
                throw err;
            }
        }
    } catch (exp) {
        console.log(`scenario failed with exception = ${exp}`)
        expect.fail(exp)
    }
});
*/