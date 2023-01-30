const domus_cookie_validator_moc = require('../mocresponse/authdomuscookieresponse')
const { expect } = require('chai');
const { default: test } = require('node:test');




function createTestData(serviceName, test_data, test_data_body){
    let test_data_body_return = null;

    if(serviceName === 'create prospect'){
        if (test_data === 'new record with All fields') {
            test_data_body_return = {
                created_on: test_data_body.created_on, //required
                brand_identifier: test_data_body.brand_identifier, //required
                channel_identifier: test_data_body.channel_identifier,//optional
                first_name: test_data_body.first_name //optional
            }
        } else if (test_data === 'new recored with only mandatory fields') {
            test_data_body_return = {
                created_on: test_data_body.created_on, //required
                brand_identifier: test_data_body.brand_identifier, //required
            }

        } else if (test_data === 'new recored without first_name') {
            test_data_body_return = {
                created_on: test_data_body.created_on, //required
                brand_identifier: test_data_body.brand_identifier, //required
                channel_identifier: test_data_body.channel_identifier,//optional
            }

        } else if (test_data === 'new record without channel_identifier') {
            test_data_body_return = {
                created_on: test_data_body.created_on, //required
                brand_identifier: test_data_body.brand_identifier, //required
                first_name: test_data_body.first_name //optional
            }

        } 
        //invlaid conditions
        else if (test_data === 'invalid value of x-authorization-id') {
            test_data_body_return = {
                created_on: test_data_body.created_on, //required
                brand_identifier: test_data_body.brand_identifier, //required
            }
        }else if (test_data === 'new recored without created_on') {
            test_data_body_return = {
                brand_identifier: test_data_body.brand_identifier, //required
                channel_identifier: test_data_body.channel_identifier,//optional
                first_name: test_data_body.first_name //optional
            }
        }else if (test_data === 'new recored with created_on as blank') {
            test_data_body_return = {
                created_on: "", //required
                brand_identifier: test_data_body.brand_identifier, //required
                channel_identifier: test_data_body.channel_identifier,//optional
                first_name: test_data_body.first_name //optional
            }
        }else if (test_data === 'new recored without brand_identifier') {
            test_data_body_return = {
                created_on: test_data_body.created_on, //required
                channel_identifier: test_data_body.channel_identifier,//optional
                first_name: test_data_body.first_name //optional
            }
        }else if (test_data === 'new recored with brand_identifier as blank') {
            test_data_body_return = {
                created_on: test_data_body.created_on, //required
                brand_identifier: "", //required
                channel_identifier: test_data_body.channel_identifier,//optional
                first_name: test_data_body.first_name //optional
            }
        }else if (test_data === 'new record with only optional fields') {
            test_data_body_return = {
                channel_identifier: test_data_body.channel_identifier,//optional
                first_name: test_data_body.first_name //optional
            }
        }else if (test_data === 'new record with mandatory fields as blank') {
            test_data_body_return = {
                created_on: "", //required
                brand_identifier: "", //required
                channel_identifier: test_data_body.channel_identifier,//optional
                first_name: test_data_body.first_name //optional
            }
        }else if (test_data === 'new record with first_name as blank') {
            test_data_body_return = {
                created_on: test_data_body.created_on, //required
                brand_identifier: test_data_body.brand_identifier, //required
                channel_identifier: test_data_body.hannel_identifier,//optional
                first_name: "" //optional
            }
        }else if (test_data === 'new record with channel_identifier as blank') {
            test_data_body_return = {
                created_on: test_data_body.created_on, //required
                brand_identifier: test_data_body.brand_identifier, //required
                channel_identifier: "",//optional
                first_name: test_data_body.first_name //optional
            }
        }else if (test_data === 'new record with optional fields as blank') {
            test_data_body_return = {
                created_on: test_data_body.created_on, //required
                brand_identifier: test_data_body.brand_identifier, //required
                channel_identifier: "",//optional
                first_name: "" //optional
            }
        }else if (test_data === 'new record with created_on as Number') {
            test_data_body_return = {
                created_on: 1234, //required
                brand_identifier: test_data_body.brand_identifier, //required
                channel_identifier: test_data_body.channel_identifier,//optional
                first_name: test_data_body.first_name //optional
            }
        }else if (test_data === 'new record with created_on as an invalid Date String') {
            test_data_body_return = {
                created_on: "44-01-2022", //required
                brand_identifier: test_data_body.brand_identifier, //required
                channel_identifier: test_data_body.channel_identifier,//optional
                first_name: test_data_body.first_name //optional
            }
        }else if (test_data === 'new record with brand_identifier as Number') {
            test_data_body_return = {
                created_on: test_data_body.created_on, //required
                brand_identifier: 1234, //required
                channel_identifier: test_data_body.channel_identifier,//optional
                first_name: test_data_body.first_name //optional
            }
        }else if (test_data === 'new record with channel_identifier as Number') {
            test_data_body_return = {
                created_on: test_data_body.created_on, //required
                brand_identifier: test_data_body.brand_identifier, //required
                channel_identifier: 1234,//optional
                first_name: test_data_body.first_name //optional
            }
        }else if (test_data === 'new record with first_name as Number') {
            test_data_body_return = {
                created_on: test_data_body.created_on, //required
                brand_identifier: test_data_body.brand_identifier, //required
                channel_identifier: test_data_body.channel_identifier,//optional
                first_name: 1234 //optional
            }
        }else {
            throw `Undefined test data Scenario - ${test_data}`;
        }
    }else if(['add prospect contact using prospect id', 'add prospect contact'].includes(serviceName)){
        if (test_data === 'update prospect only') {
            test_data_body_return = [
                {
                    "IdentifierType": "first_name",
                    "IdentifierValue": test_data_body.first_name,
                    "ActiveFrom": test_data_body.active_from
                },
                {
                    "IdentifierType": "channel_identifier",
                    "IdentifierValue": test_data_body.channel_identifier,
                    "ActiveFrom": test_data_body.active_from
                },
                {
                    "IdentifierType": "brand_identifier",
                    "IdentifierValue": test_data_body.brand_identifier,
                    "ActiveFrom": test_data_body.active_from
                },
            ]
        }else if(test_data === 'update prospect identifier only') {
            test_data_body_return = [
                {
                    "IdentifierType": "phone",
                    "IdentifierValue": test_data_body.phone,
                    "ActiveFrom": test_data_body.active_from
                },
                {
                    "IdentifierType": "email",
                    "IdentifierValue": test_data_body.email,
                    "ActiveFrom": test_data_body.active_from
                },
                {
                    "IdentifierType": "mobile",
                    "IdentifierValue": test_data_body.mobile,
                    "ActiveFrom": test_data_body.active_from
                },
            ]
        }else if(test_data === 'update both prospect and prospect identifier') {
            test_data_body_return = [
                {
                    "IdentifierType": "first_name",
                    "IdentifierValue": test_data_body.first_name,
                    "ActiveFrom": test_data_body.active_from
                },
                {
                    "IdentifierType": "channel_identifier",
                    "IdentifierValue": test_data_body.channel_identifier,
                    "ActiveFrom": test_data_body.active_from
                },
                {
                    "IdentifierType": "brand_identifier",
                    "IdentifierValue": test_data_body.brand_identifier,
                    "ActiveFrom": test_data_body.active_from
                },
                {
                    "IdentifierType": "phone",
                    "IdentifierValue": test_data_body.phone,
                    "ActiveFrom": test_data_body.active_from
                },
                {
                    "IdentifierType": "email",
                    "IdentifierValue": test_data_body.email,
                    "ActiveFrom": test_data_body.active_from
                },
                {
                    "IdentifierType": "mobile",
                    "IdentifierValue": test_data_body.mobile,
                    "ActiveFrom": test_data_body.active_from
                },
            ]
        }else if(test_data === 'invalid value of x-authorization-id') {
            test_data_body_return = [
                {
                    "IdentifierType": "first_name",
                    "IdentifierValue": test_data_body.first_name,
                    "ActiveFrom": test_data_body.active_from
                },
                {
                    "IdentifierType": "channel_identifier",
                    "IdentifierValue": test_data_body.channel_identifier,
                    "ActiveFrom": test_data_body.active_from
                },
                {
                    "IdentifierType": "brand_identifier",
                    "IdentifierValue": test_data_body.brand_identifier,
                    "ActiveFrom": test_data_body.active_from
                },
                {
                    "IdentifierType": "phone",
                    "IdentifierValue": test_data_body.phone,
                    "ActiveFrom": test_data_body.active_from
                },
                {
                    "IdentifierType": "email",
                    "IdentifierValue": test_data_body.email,
                    "ActiveFrom": test_data_body.active_from
                },
                {
                    "IdentifierType": "mobile",
                    "IdentifierValue": test_data_body.mobile,
                    "ActiveFrom": test_data_body.active_from
                },
            ]
        }
        // invalid conditions
        else if(test_data === 'Body is not an array') {
            test_data_body_return = {
                "IdentifierType": "first_name",
                "IdentifierValue": "test_data_body.first_name",
                "ActiveFrom": "test_data_body.active_from"
            }
        }else if(test_data === 'Body has and empty array') {
            test_data_body_return = []
        }else if(test_data === 'Empty body in an array') {
            test_data_body_return = [{}]
        }else if(test_data === 'IdentifierType not provided in body') {
            test_data_body_return = [
                {
                    "IdentifierValue": test_data_body.first_name,
                    "ActiveFrom": test_data_body.active_from
                },
            ]
        }else if(test_data === 'IdentifierType is a number') {
            test_data_body_return = [
                {
                    "IdentifierType": 1234,
                    "IdentifierValue": test_data_body.first_name,
                    "ActiveFrom": test_data_body.active_from
                },
            ]
        }else if(test_data === 'IdentifierValue not provided in body') {
            test_data_body_return = [
                {
                    "IdentifierType": "first_name",
                    "ActiveFrom": test_data_body.active_from
                },
            ]
        }else if(test_data === 'IdentifierValue is a number') {
            test_data_body_return = [
                {
                    "IdentifierType": "first_name",
                    "IdentifierValue": 1234,
                    "ActiveFrom": test_data_body.active_from
                },
            ]
        }else if(test_data === 'ActiveFrom not provided in body') {
            test_data_body_return = [
                {
                    "IdentifierType": "first_name",
                    "IdentifierValue": test_data_body.first_name,
                },
            ]
        }else if(test_data === 'ActiveFrom is a invalid date string') {
            test_data_body_return = [
                {
                    "IdentifierType": "first_name",
                    "IdentifierValue": test_data_body.first_name,
                    "ActiveFrom": "33-10-2023"
                },
            ]
        }
        else {
            throw `Undefined test data Scenario - ${test_data}`;
        }
    }else{
        throw `service name is not defined - ${serviceName}`;
    }
    return test_data_body_return
}

async function setDomusCookieValidatorMOC(user_type, identifier) {
    //Set MOC values to be used by the DEV COCE
    // MOC values will only be set for LOCAL and DEV environments

    if (['LOCAL', 'DEV'].includes(process.env.ENV)) {
        console.log(`Executing test on ${process.env.ENV}`)
        console.log("Setting MOCK values for DOMUS Cookie validator service")

        try {
            if (user_type === 'UNAUTH Customer') {
                await domus_cookie_validator_moc.setMocValues({
                    "id": 1,
                    "userType": "UNAUTH_CUSTOMER",
                    "sub": identifier,
                    "exp": 1666343413
                })
            } else if (user_type === 'IB CUSTOMER') {
                await domus_cookie_validator_moc.setMocValues({
                    "id": 1,
                    "userType": "IB_CUSTOMER",
                    "sub": identifier,
                    "exp": 1666343413
                })
            } else {
                await domus_cookie_validator_moc.setMocValues({
                    "id": 1,
                    "userType": user_type,
                    "sub": identifier,
                    "exp": 1666343413
                })
            }
        } catch (exx) {
            console.log(exx)
            throw exx;
        }
        console.log(`MOC values set as - userType = ${user_type} and sub = ${identifier}`);
        console.log("The MOC is set to return the followign response")
        console.log(await domus_cookie_validator_moc.getMocValues())
    } else {
        //MOC is not requried
        console.log(`MOC is not requried on any ENV = ${process.env.ENV}`)
    }
}

function validateResponse(serviceName, test_data, prospectIDCreated, user_type, identifier){
    const actual_response = global.response;
    //Print response on screen
    console.log("Actual Response received is- ");
    console.log(actual_response.data)
    console.log("Response status code is ")
    console.log(actual_response.status)
    
    if(serviceName === 'create prospect'){
        try {
            //invlaid conditions
            if(test_data === 'existing value of x-authorization-id'){
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data.message).to.be.a('string').that.contains('ProspectId, already exist in the system.')
    
            }else if(test_data === 'invalid value of x-authorization-id'){
                const validation_object = {
                    error: [
                        {
                            "message": "\"x-authorization-id\" is required",
                            "path": [
                                "x-authorization-id"
                            ],
                            "type": "any.required",
                            "context": {
                                "label": "x-authorization-id",
                                "key": "x-authorization-id"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'new recored without created_on') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"created_on\" is required",
                            "path": [
                                "created_on"
                            ],
                            "type": "any.required",
                            "context": {
                                "label": "created_on",
                                "key": "created_on"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'new recored with created_on as blank') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"created_on\" must be a valid date",
                            "path": [
                                "created_on"
                            ],
                            "type": "date.base",
                            "context": {
                                "label": "created_on",
                                "value": "",
                                "key": "created_on"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'new recored without brand_identifier') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"brand_identifier\" is required",
                            "path": [
                                "brand_identifier"
                            ],
                            "type": "any.required",
                            "context": {
                                "label": "brand_identifier",
                                "key": "brand_identifier"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'new recored with brand_identifier as blank') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"brand_identifier\" is not allowed to be empty",
                            "path": [
                                "brand_identifier"
                            ],
                            "type": "string.empty",
                            "context": {
                                "label": "brand_identifier",
                                "value": "",
                                "key": "brand_identifier"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'new record with only optional fields') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"created_on\" is required",
                            "path": [
                                "created_on"
                            ],
                            "type": "any.required",
                            "context": {
                                "label": "created_on",
                                "key": "created_on"
                            }
                        },
                        {
                            "message": "\"brand_identifier\" is required",
                            "path": [
                                "brand_identifier"
                            ],
                            "type": "any.required",
                            "context": {
                                "label": "brand_identifier",
                                "key": "brand_identifier"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'new record with mandatory fields as blank') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"created_on\" must be a valid date",
                            "path": [
                                "created_on"
                            ],
                            "type": "date.base",
                            "context": {
                                "label": "created_on",
                                "value": "",
                                "key": "created_on"
                            }
                        },
                        {
                            "message": "\"brand_identifier\" is not allowed to be empty",
                            "path": [
                                "brand_identifier"
                            ],
                            "type": "string.empty",
                            "context": {
                                "label": "brand_identifier",
                                "value": "",
                                "key": "brand_identifier"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'new record with first_name as blank') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"first_name\" is not allowed to be empty",
                            "path": [
                                "first_name"
                            ],
                            "type": "string.empty",
                            "context": {
                                "label": "first_name",
                                "value": "",
                                "key": "first_name"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'new record with channel_identifier as blank') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"channel_identifier\" is not allowed to be empty",
                            "path": [
                                "channel_identifier"
                            ],
                            "type": "string.empty",
                            "context": {
                                "label": "channel_identifier",
                                "value": "",
                                "key": "channel_identifier"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'new record with optional fields as blank') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"channel_identifier\" is not allowed to be empty",
                            "path": [
                                "channel_identifier"
                            ],
                            "type": "string.empty",
                            "context": {
                                "label": "channel_identifier",
                                "value": "",
                                "key": "channel_identifier"
                            }
                        },
                        {
                            "message": "\"first_name\" is not allowed to be empty",
                            "path": [
                                "first_name"
                            ],
                            "type": "string.empty",
                            "context": {
                                "label": "first_name",
                                "value": "",
                                "key": "first_name"
                            }
                        }
                    ]
                };
    
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'new record with created_on as Number') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"created_on\" must be a string",
                            "path": [
                                "created_on"
                            ],
                            "type": "string.base",
                            "context": {
                                "label": "created_on",
                                "value": 1234,
                                "key": "created_on"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'new record with created_on as an invalid Date String') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"created_on\" must be a valid date",
                            "path": [
                                "created_on"
                            ],
                            "type": "date.base",
                            "context": {
                                "label": "created_on",
                                "value": "44-01-2022",
                                "key": "created_on"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'new record with brand_identifier as Number') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"brand_identifier\" must be a string",
                            "path": [
                                "brand_identifier"
                            ],
                            "type": "string.base",
                            "context": {
                                "label": "brand_identifier",
                                "value": 1234,
                                "key": "brand_identifier"
                            }
                        }
                    ]
                };
                
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'new record with channel_identifier as Number') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"channel_identifier\" must be a string",
                            "path": [
                                "channel_identifier"
                            ],
                            "type": "string.base",
                            "context": {
                                "label": "channel_identifier",
                                "value": 1234,
                                "key": "channel_identifier"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'new record with first_name as Number') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"first_name\" must be a string",
                            "path": [
                                "first_name"
                            ],
                            "type": "string.base",
                            "context": {
                                "label": "first_name",
                                "value": 1234,
                                "key": "first_name"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else {
                //validate stauts
                console.log("valid condition test")
                expect(actual_response.status).to.be.equal(200);
                //validate body
                //validate body to not be null or empty. Check that the prospect id is present in the response
                expect(actual_response.data.message).to.not.be.equal(null); // not be null
                expect(actual_response.data.message.trim()).to.not.be.equal(""); //not be empty
                expect(parseInt(actual_response.data.message.split(" ")[1])).to.satisfy(Number.isInteger); //check for prospect id
            }
        } catch (exp) {
            throw exp;
        }
    }else if(['add prospect contact using prospect id', 'add prospect contact'].includes(serviceName)){
        try{
            //invlaid conditions
            if(test_data === 'in-valid user'){
                //validate stauts
                console.log("in-valid condition test")
                expect(actual_response.status).to.be.equal(400);
                expect(actual_response.data.error).to.be.equal(`Auth userType: ${user_type}, is not valid.`);
            }else if(test_data === 'in-valid identifier'){
                //validate stauts
                console.log("in-valid condition test")
                expect(actual_response.status).to.be.equal(404);
                if(user_type === 'UNAUTH Customer'){
                    expect(actual_response.data.error).to.be.equal(`Prospect Record not found with userType and sub`);
                }else{
                    expect(actual_response.data.error).to.be.equal(`Prospect Record not found with userType and sub`);
                }
            }else if(test_data === 'in-valid prospect id'){
                //validate stauts
                console.log("in-valid condition test")
                expect(actual_response.status).to.be.equal(404);
                if(user_type === 'UNAUTH Customer'){
                    expect(actual_response.data.error).to.be.equal(`ProspectId in the request is not associated with userType and sub`);
                }else{
                    expect(actual_response.data.error).to.be.equal(`ProspectId in the request is not associated with userType and sub`);
                }
            }else if (test_data === 'Body is not an array') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"value\" must be an array",
                            "path": [],
                            "type": "array.base",
                            "context": {
                                "label": "value",
                                "value": {
                                    "IdentifierType": "first_name",
                                    "IdentifierValue": "test_data_body.first_name",
                                    "ActiveFrom": "test_data_body.active_from"
                                }
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                console.log(actual_response.data)
                expect(actual_response.data).to.deep.equal(validation_object.error);
            }else if (test_data === 'invalid value of x-authorization-id') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"x-authorization-id\" is required",
                            "path": [
                                "x-authorization-id"
                            ],
                            "type": "any.required",
                            "context": {
                                "label": "x-authorization-id",
                                "key": "x-authorization-id"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                console.log(actual_response.data)
                expect(actual_response.data).to.deep.equal(validation_object.error);
            }else if (test_data === 'Body has and empty array') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"value\" must contain at least 1 items",
                            "path": [],
                            "type": "array.min",
                            "context": {
                                "limit": 1,
                                "value": [],
                                "label": "value"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'Empty body in an array') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"[0].IdentifierType\" is required",
                            "path": [
                                0,
                                "IdentifierType"
                            ],
                            "type": "any.required",
                            "context": {
                                "label": "[0].IdentifierType",
                                "key": "IdentifierType"
                            }
                        },
                        {
                            "message": "\"[0].IdentifierValue\" is required",
                            "path": [
                                0,
                                "IdentifierValue"
                            ],
                            "type": "any.required",
                            "context": {
                                "label": "[0].IdentifierValue",
                                "key": "IdentifierValue"
                            }
                        },
                        {
                            "message": "\"[0].ActiveFrom\" is required",
                            "path": [
                                0,
                                "ActiveFrom"
                            ],
                            "type": "any.required",
                            "context": {
                                "label": "[0].ActiveFrom",
                                "key": "ActiveFrom"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'IdentifierType not provided in body') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"[0].IdentifierType\" is required",
                            "path": [
                                0,
                                "IdentifierType"
                            ],
                            "type": "any.required",
                            "context": {
                                "label": "[0].IdentifierType",
                                "key": "IdentifierType"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'IdentifierType is a number') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"[0].IdentifierType\" must be a string",
                            "path": [
                                0,
                                "IdentifierType"
                            ],
                            "type": "string.base",
                            "context": {
                                "label": "[0].IdentifierType",
                                "value": 1234,
                                "key": "IdentifierType"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'IdentifierValue not provided in body') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"[0].IdentifierValue\" is required",
                            "path": [
                                0,
                                "IdentifierValue"
                            ],
                            "type": "any.required",
                            "context": {
                                "label": "[0].IdentifierValue",
                                "key": "IdentifierValue"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'IdentifierValue is a number') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"[0].IdentifierValue\" must be a string",
                            "path": [
                                0,
                                "IdentifierValue"
                            ],
                            "type": "string.base",
                            "context": {
                                "label": "[0].IdentifierValue",
                                "value": 1234,
                                "key": "IdentifierValue"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'ActiveFrom not provided in body') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"[0].ActiveFrom\" is required",
                            "path": [
                                0,
                                "ActiveFrom"
                            ],
                            "type": "any.required",
                            "context": {
                                "label": "[0].ActiveFrom",
                                "key": "ActiveFrom"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else if (test_data === 'ActiveFrom is a invalid date string') {
                
                const validation_object = {
                    error: [
                        {
                            "message": "\"[0].ActiveFrom\" must be a valid date",
                            "path": [
                                0,
                                "ActiveFrom"
                            ],
                            "type": "date.base",
                            "context": {
                                "label": "[0].ActiveFrom",
                                "value": "33-10-2023",
                                "key": "ActiveFrom"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
    
            }else {
                 //validate stauts
                 console.log("valid condition test")
                 expect(actual_response.status).to.be.equal(200);
                 //validate body
                 //validate body to not be null or empty. Check that the prospect id is present in the response
                 expect(actual_response.data.ProspectId).to.not.be.equal(null); // not be null
                 expect(parseInt(actual_response.data.ProspectId)).to.be.equal(parseInt(prospectIDCreated)); //check for prospect id
            }
        }catch(exp){
            throw exp;
        }
    }else if(['find prospect', 'find prospect using prospect id'].includes(serviceName)){
        try{
            //invlaid conditions
            if(test_data === 'x-auth-value is not valid'){
                //validate status
                expect(actual_response.status).to.be.equal(404);
                //validate body
                expect(actual_response.data.error).to.be.a('string').that.contains('Prospect could not found in the system')
            }else if(test_data === 'Invalid-request-wrong-values'){
                //validate status
                expect(actual_response.status).to.be.equal(404);
                //validate body
                expect(actual_response.data.error).to.be.a('string').that.contains('Prospect Record does not exist with IdentifierType and IdentifierValue in the system')
            }


            else if(test_data === 'IdentifierType not sent in request'){
                const validation_object = {
                    error: [
                        {
                            "message": "\"IdentifierType\" is required",
                            "path": [
                                "IdentifierType"
                            ],
                            "type": "any.required",
                            "context": {
                                "label": "IdentifierType",
                                "key": "IdentifierType"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
            }
            else if(test_data === 'IdentifierType is not a string'){
                const validation_object = {
                    error: [
                        {
                            "message": "\"IdentifierType\" must be a string",
                            "path": [
                                "IdentifierType"
                            ],
                            "type": "string.base",
                            "context": {
                                "label": "IdentifierType",
                                "value": 1234,
                                "key": "IdentifierType"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
            }
            else if(test_data === 'IdentifierValue not sent in request'){
                const validation_object = {
                    error: [
                        {
                            "message": "\"IdentifierValue\" is required",
                            "path": [
                                "IdentifierValue"
                            ],
                            "type": "any.required",
                            "context": {
                                "label": "IdentifierValue",
                                "key": "IdentifierValue"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
            }
            else if(test_data === 'IdentifierValue is not a string'){
                const validation_object = {
                    error: [
                        {
                            "message": "\"IdentifierValue\" must be a string",
                            "path": [
                                "IdentifierValue"
                            ],
                            "type": "string.base",
                            "context": {
                                "label": "IdentifierValue",
                                "value": 1234,
                                "key": "IdentifierValue"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
            }
            else if(test_data === 'Empty Request Body'){
                const validation_object = {
                    error: [
                        {
                            "message": "\"IdentifierType\" is required",
                            "path": [
                                "IdentifierType"
                            ],
                            "type": "any.required",
                            "context": {
                                "label": "IdentifierType",
                                "key": "IdentifierType"
                            }
                        },
                        {
                            "message": "\"IdentifierValue\" is required",
                            "path": [
                                "IdentifierValue"
                            ],
                            "type": "any.required",
                            "context": {
                                "label": "IdentifierValue",
                                "key": "IdentifierValue"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
            }
            else if(test_data === 'Values not sent as String'){
                const validation_object = {
                    error: [
                        {
                            "message": "\"IdentifierType\" must be a string",
                            "path": [
                                "IdentifierType"
                            ],
                            "type": "string.base",
                            "context": {
                                "label": "IdentifierType",
                                "value": 1234,
                                "key": "IdentifierType"
                            }
                        },
                        {
                            "message": "\"IdentifierValue\" must be a string",
                            "path": [
                                "IdentifierValue"
                            ],
                            "type": "string.base",
                            "context": {
                                "label": "IdentifierValue",
                                "value": 1234,
                                "key": "IdentifierValue"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
            }
            else if(test_data === 'invalid value of x-authorization-id'){
                const validation_object = {
                    error: [
                        {
                            "message": "\"x-authorization-id\" is required",
                            "path": [
                                "x-authorization-id"
                            ],
                            "type": "any.required",
                            "context": {
                                "label": "x-authorization-id",
                                "key": "x-authorization-id"
                            }
                        }
                    ]
                };
    
                //validate status
                expect(actual_response.status).to.be.equal(400);
                //validate body
                expect(actual_response.data).to.deep.equal(validation_object.error);
            }
            else{
                //validate stauts
                 console.log("valid condition test")
                 expect(actual_response.status).to.be.equal(200);
                 //validate body
                 //validate body to not be null or empty. Check that the prospect id is present in the response
                 expect(actual_response.data.prospect[0].prospect_id).to.not.be.equal(null); // not be null
                 expect(parseInt(actual_response.data.prospect[0].prospect_id)).to.be.equal(parseInt(prospectIDCreated)); //check for prospect id

                 expect(actual_response.data.prospect_identifier[0].prospect_id).to.not.be.equal(null); // not be null
                 expect(parseInt(actual_response.data.prospect_identifier[0].prospect_id)).to.be.equal(parseInt(prospectIDCreated)); //check for prospect id

                 expect(actual_response.data.prospect_identifier.length).to.be.equal(1);

            }  
        }catch(err){
            throw err;
        }
    }else if(['create intent'].includes(serviceName)){
        if(test_data === 'valid request'){
            //validate status
            expect(actual_response.status).to.be.equal(200);
            //validate body
            expect(actual_response.data.message).to.be.a('string').that.contains('is created successfully')
        }else if(test_data === 'duplicate request'){
            //validate status
            expect(actual_response.status).to.be.equal(404);
            //validate body
            expect(actual_response.data.message).to.be.a('string').that.contains('Intent with ProspectId, already exist in the system.')
        }else if(test_data === 'in-valid prospect id'){
            //validate status
            expect(actual_response.status).to.be.equal(404);
            //validate body
            expect(actual_response.data.error).to.be.a('string').that.contains('ProspectId in the request is not associated with userType and sub')
        }else if (test_data == 'in-valid user type'){
            //validate status
            expect(actual_response.status).to.be.equal(404);
            //validate body
            expect(actual_response.data.error).to.be.a('string').that.contains("Prospect with userType and sub doesn't exist in the records")
        }else if(test_data === 'without intent_questionaire_payload'){
            const validation_object = {
                error: [
                    {
                        "message": "\"intent_questionaire_payload\" is required",
                        "path": [
                            "intent_questionaire_payload"
                        ],
                        "type": "any.required",
                        "context": {
                            "label": "intent_questionaire_payload",
                            "key": "intent_questionaire_payload"
                        }
                    }
                ]
            };

            //validate status
            expect(actual_response.status).to.be.equal(400);
            //validate body
            expect(actual_response.data).to.deep.equal(validation_object.error);

        }else if(test_data === 'without active_from'){
            const validation_object = {
                error: [
                    {
                        "message": "\"active_from\" is required",
                        "path": [
                            "active_from"
                        ],
                        "type": "any.required",
                        "context": {
                            "label": "active_from",
                            "key": "active_from"
                        }
                    }
                ]
            };

            //validate status
            expect(actual_response.status).to.be.equal(400);
            //validate body
            expect(actual_response.data).to.deep.equal(validation_object.error);
            
        }else if(test_data === 'active_from not as a valid string'){

            const validation_object = {
                error: [
                    {
                        "message": "\"active_from\" must be a valid date",
                        "path": [
                            "active_from"
                        ],
                        "type": "date.base",
                        "context": {
                            "label": "active_from",
                            "value": "2023-01-44T12:26:06.521Z",
                            "key": "active_from"
                        }
                    }
                ]
            };

            //validate status
            expect(actual_response.status).to.be.equal(400);
            //validate body
            expect(actual_response.data).to.deep.equal(validation_object.error);

            
        }else if(test_data === 'active_from is a number'){

            const validation_object = {
                error: [
                    {
                        "message": "\"active_from\" must be a valid date",
                        "path": [
                            "active_from"
                        ],
                        "type": "date.base",
                        "context": {
                            "label": "active_from",
                            "value": "2023-01-44T12:26:06.521Z",
                            "key": "active_from"
                        }
                    }
                ]
            };

            //validate status
            expect(actual_response.status).to.be.equal(400);
            //validate body
            expect(actual_response.data).to.deep.equal(validation_object.error);
 
        }else if(test_data === 'intent_questionaire_payload is a number'){
            const validation_object = {
                error: [
                    {
                        "message": "\"intent_questionaire_payload\" is required",
                        "path": [
                            "intent_questionaire_payload"
                        ],
                        "type": "any.required",
                        "context": {
                            "label": "intent_questionaire_payload",
                            "key": "intent_questionaire_payload"
                        }
                    }
                ]
            };

            //validate status
            expect(actual_response.status).to.be.equal(400);
            //validate body
            expect(actual_response.data).to.deep.equal(validation_object.error);

            
        }else if(test_data === 'intent_questionaire_payload is a string'){

            const validation_object = {
                error: [
                    {
                        "message": "\"intent_questionaire_payload\" is required",
                        "path": [
                            "intent_questionaire_payload"
                        ],
                        "type": "any.required",
                        "context": {
                            "label": "intent_questionaire_payload",
                            "key": "intent_questionaire_payload"
                        }
                    }
                ]
            };

            //validate status
            expect(actual_response.status).to.be.equal(400);
            //validate body
            expect(actual_response.data).to.deep.equal(validation_object.error);
            
        }else if(test_data === 'invalid value of x-authorization-id'){

            const validation_object = {
                error: [
                    {
                        "message": "\"x-authorization-id\" is required",
                        "path": [
                            "x-authorization-id"
                        ],
                        "type": "any.required",
                        "context": {
                            "label": "x-authorization-id",
                            "key": "x-authorization-id"
                        }
                    }
                ]
            };

            //validate status
            expect(actual_response.status).to.be.equal(400);
            //validate body
            expect(actual_response.data).to.deep.equal(validation_object.error);
            
        }else{
            throw `test data is not defined - ${test_data}`
        }
    }else if(['find intent', 'find intent by id'].includes(serviceName)){
        if(test_data === 'in-valid user type'){
            //validate status
            expect(actual_response.status).to.be.equal(404);
            //validate body
            expect(actual_response.data.error).to.be.a('string').that.contains('Prospect Record not found with userType and sub')
        }else if(test_data === 'invalid prospect id'){
            //validate status
            expect(actual_response.status).to.be.equal(404);
            //validate body
            expect(actual_response.data.error).to.be.a('string').that.contains('ProspectId in the request is not associated with userType and sub')
        }else if(test_data === 'intent not found'){
            //validate status
            expect(actual_response.status).to.be.equal(404);
            //validate body
            if(serviceName === 'find intent by id'){
                expect(actual_response.data.error).to.be.a('string').that.contains('No Intent Record found with ProspectId')
            }else{
                expect(actual_response.data.error).to.be.a('string').that.contains('No Active Intent Record found with ProspectId')
            }
        }else if(test_data === 'invalid value of x-authorization-id'){
            const validation_object = {
                error: [
                    {
                        "message": "\"x-authorization-id\" is required",
                        "path": [
                            "x-authorization-id"
                        ],
                        "type": "any.required",
                        "context": {
                            "label": "x-authorization-id",
                            "key": "x-authorization-id"
                        }
                    }
                ]
            };

            //validate status
            expect(actual_response.status).to.be.equal(400);
            //validate body
            expect(actual_response.data).to.deep.equal(validation_object.error);
        }else if(test_data === 'invalid intent id'){
            //validate status
            expect(actual_response.status).to.be.equal(404);
            //validate body
            expect(actual_response.data.error).to.be.a('string').that.contains('No Intent Record found with ProspectId')
        }
        else{
            throw `test data is not defied - ${test_data}`
        }
    }
    else{
        throw `service name is not defined - ${serviceName}`;
    }
}

function validateResponseInDB(serviceName, test_data, user_type, actual_response_find, responseToVerify) {

    //modify the respnse of find to remove remove the time
    if(['create intent'].includes(serviceName)){
        // Find Intent
        actual_response_find.data.prospect.forEach(element => {
            element.created_on = element.created_on.split('T')[0]; 
        });

        actual_response_find.data.intent.forEach(element => {
            element.active_from = element.active_from.split('T')[0]; 
            if(element.active_to != null){
                element.active_to = element.active_to.split('T')[0]; 
            }
            element.intent_questionaire_payload = JSON.parse(element.intent_questionaire_payload)
        });

    }else{
        //Find Prospect
        actual_response_find.data.prospect.forEach(element => {
            element.created_on = element.created_on.split('T')[0]; 
        });
        try{
            actual_response_find.data.prospect_identifiers.forEach(element => {
                element.active_from = element.active_from.split('T')[0]; 
                if(element.active_to != null){
                    element.active_to = element.active_to.split('T')[0]; 
                }
            });
        }catch(err){
            // this is for the find prospect without id
            actual_response_find.data.prospect_identifier.forEach(element => {
                element.active_from = element.active_from.split('T')[0]; 
                if(element.active_to != null){
                    element.active_to = element.active_to.split('T')[0]; 
                }
            });
        }
    }
    
    if (serviceName === 'create prospect') {
        //verify the elements 
        //verify prospect
        expect(actual_response_find.data.prospect[0].created_on.split('T')[0]).to.be.equal(responseToVerify.created_on.toISOString().split('T')[0]);
        expect(actual_response_find.data.prospect[0].prospect_id.toString()).to.be.equal(responseToVerify.prospectIDCreated);
        expect(actual_response_find.data.prospect[0].brand_identifier).to.be.equal(responseToVerify.brand_identifier);

        if (test_data === 'new recored with only mandatory fields') {
            expect(actual_response_find.data.prospect[0].channel_identifier).to.be.equal("");
            expect(actual_response_find.data.prospect[0].first_name).to.be.equal("");
        } else {
            if (test_data === 'new record without channel_identifier') {
                expect(actual_response_find.data.prospect[0].channel_identifier).to.be.equal("");
            } else {
                expect(actual_response_find.data.prospect[0].channel_identifier).to.be.equal(responseToVerify.channel_identifier);
            }

            if (test_data === 'new recored without first_name') {
                expect(actual_response_find.data.prospect[0].first_name).to.be.equal("");
            } else {
                expect(actual_response_find.data.prospect[0].first_name).to.be.equal(responseToVerify.first_name);
            }
        }
        //verify prospect identifier
        expect(actual_response_find.data.prospect_identifiers[0].prospect_identifier_id).to.not.be.equal(null);
        expect(actual_response_find.data.prospect_identifiers[0].prospect_id.toString()).to.be.equal(responseToVerify.prospectIDCreated);
        expect(actual_response_find.data.prospect_identifiers[0].identifier).to.be.equal(responseToVerify.identifier.toString());
        if (user_type === 'UNAUTH Customer') {
            expect(actual_response_find.data.prospect_identifiers[0].identifier_type).to.be.equal("SessionId");
        } else {
            expect(actual_response_find.data.prospect_identifiers[0].identifier_type).to.be.equal("IBID");
        }
        expect(actual_response_find.data.prospect_identifiers[0].active_from.split('T')[0]).to.be.equal(responseToVerify.created_on.toISOString().split('T')[0]);
        expect(actual_response_find.data.prospect_identifiers[0].active_to).to.be.equal(null);
    }else if(['add prospect contact using prospect id', 'add prospect contact'].includes(serviceName)) {
        //verify the elements 
        //verify prospect
        expect(actual_response_find.data.prospect[0].created_on.split('T')[0]).to.be.equal(responseToVerify.created_on.toISOString().split('T')[0]);
        expect(actual_response_find.data.prospect[0].prospect_id.toString()).to.be.equal(responseToVerify.prospectIDCreated);
        expect(actual_response_find.data.prospect[0].brand_identifier).to.be.equal(responseToVerify.brand_identifier);
        expect(actual_response_find.data.prospect[0].channel_identifier).to.be.equal(responseToVerify.channel_identifier);
        expect(actual_response_find.data.prospect[0].first_name).to.be.equal(responseToVerify.first_name);
        //verify prospect identifier
        
        
        if(['update prospect identifier only', 'update both prospect and prospect identifier'].includes(test_data)){ 
            actual_response_find.data.prospect_identifiers.forEach(element => {
                if(['SessionId', 'IBID'].includes(element.identifier_type)){
                    if(user_type === 'UNAUTH Customer'){
                        expect(element.identifier_type).to.be.equal('SessionId')
                    }else{
                        expect(element.identifier_type).to.be.equal('IBID')
                    }
                    expect(element.prospect_identifier_id).to.not.be.equal(null);
                    expect(element.prospect_id.toString()).to.be.equal(responseToVerify.prospectIDCreated);
                    expect(element.identifier).to.be.equal(responseToVerify.identifier.toString());
                    expect(element.active_from.split('T')[0]).to.be.equal(responseToVerify.created_on.toISOString().split('T')[0]);
                    expect(actual_response_find.data.prospect_identifiers[0].active_to).to.not.be.equal(null);
                    expect(actual_response_find.data.prospect_identifiers[0].active_to.split('T')[0]).to.be.equal(responseToVerify.created_on.toISOString().split('T')[0]);
                }else{
                    if(element.identifier_type === 'phone'){
                        if(element.identifier === responseToVerify.phone[responseToVerify.phone.length -1]){
                            //new element added
                            expect(element.prospect_identifier_id).to.not.be.equal(null);
                            expect(element.prospect_id.toString()).to.be.equal(responseToVerify.prospectIDCreated);
                            expect(element.identifier).to.be.equal(responseToVerify.phone[responseToVerify.phone.length-1]);
                            expect(element.identifier_type).to.be.equal('phone');
                            expect(element.active_from).to.be.equal(responseToVerify.active_from[responseToVerify.active_from.length-1].toISOString().split('T')[0]);
                            expect(element.active_to).to.be.equal(null);

                        }else{
                            //old element
                            expect(element.prospect_identifier_id).to.not.be.equal(null);
                            expect(element.prospect_id.toString()).to.be.equal(responseToVerify.prospectIDCreated);
                            expect(element.identifier).to.be.equal(responseToVerify.phone[responseToVerify.phone.length-2]);
                            expect(element.identifier_type).to.be.equal('phone');
                            expect(element.active_from).to.be.equal(responseToVerify.active_from[responseToVerify.active_from.length-2].toISOString().split('T')[0]);
                            expect(element.active_to).to.not.be.equal(null);
                            expect(element.active_to).to.be.equal(responseToVerify.active_from[responseToVerify.active_from.length-2].toISOString().split('T')[0]);

                        }
                    }
                    if(element.identifier_type === 'email'){
                        if(element.identifier === responseToVerify.email[responseToVerify.email.length -1]){
                            //new element added
                            expect(element.prospect_identifier_id).to.not.be.equal(null);
                            expect(element.prospect_id.toString()).to.be.equal(responseToVerify.prospectIDCreated);
                            expect(element.identifier).to.be.equal(responseToVerify.email[responseToVerify.email.length-1]);
                            expect(element.identifier_type).to.be.equal('email');
                            expect(element.active_from).to.be.equal(responseToVerify.active_from[responseToVerify.active_from.length-1].toISOString().split('T')[0]);
                            expect(element.active_to).to.be.equal(null);

                        }else{
                            //old element
                            expect(element.prospect_identifier_id).to.not.be.equal(null);
                            expect(element.prospect_id.toString()).to.be.equal(responseToVerify.prospectIDCreated);
                            expect(element.identifier).to.be.equal(responseToVerify.email[responseToVerify.email.length-2]);
                            expect(element.identifier_type).to.be.equal('email');
                            expect(element.active_from).to.be.equal(responseToVerify.active_from[responseToVerify.active_from.length-2].toISOString().split('T')[0]);
                            expect(element.active_to).to.not.be.equal(null);
                            expect(element.active_to).to.be.equal(responseToVerify.active_from[responseToVerify.active_from.length-2].toISOString().split('T')[0]);

                        }
                    }
                    if(element.identifier_type === 'mobile'){
                        if(element.identifier === responseToVerify.mobile[responseToVerify.mobile.length -1]){
                            //new element added
                            expect(element.prospect_identifier_id).to.not.be.equal(null);
                            expect(element.prospect_id.toString()).to.be.equal(responseToVerify.prospectIDCreated);
                            expect(element.identifier).to.be.equal(responseToVerify.mobile[responseToVerify.mobile.length-1]);
                            expect(element.identifier_type).to.be.equal('mobile');
                            expect(element.active_from).to.be.equal(responseToVerify.active_from[responseToVerify.active_from.length-1].toISOString().split('T')[0]);
                            expect(element.active_to).to.be.equal(null);

                        }else{
                            //old element
                            expect(element.prospect_identifier_id).to.not.be.equal(null);
                            expect(element.prospect_id.toString()).to.be.equal(responseToVerify.prospectIDCreated);
                            expect(element.identifier).to.be.equal(responseToVerify.mobile[responseToVerify.mobile.length-2]);
                            expect(element.identifier_type).to.be.equal('mobile');
                            expect(element.active_from).to.be.equal(responseToVerify.active_from[responseToVerify.active_from.length-2].toISOString().split('T')[0]);
                            expect(element.active_to).to.not.be.equal(null);
                            expect(element.active_to).to.be.equal(responseToVerify.active_from[responseToVerify.active_from.length-2].toISOString().split('T')[0]);
                        }
                    }
                }
            });

        }else{
            expect(actual_response_find.data.prospect_identifiers[0].prospect_identifier_id).to.not.be.equal(null);
            expect(actual_response_find.data.prospect_identifiers[0].prospect_id.toString()).to.be.equal(responseToVerify.prospectIDCreated);
            expect(actual_response_find.data.prospect_identifiers[0].identifier).to.be.equal(responseToVerify.identifier.toString());
            if (user_type === 'UNAUTH Customer') {
                expect(actual_response_find.data.prospect_identifiers[0].identifier_type).to.be.equal("SessionId");
            } else {
                expect(actual_response_find.data.prospect_identifiers[0].identifier_type).to.be.equal("IBID");
            }
            expect(actual_response_find.data.prospect_identifiers[0].active_from.split('T')[0]).to.be.equal(responseToVerify.created_on.toISOString().split('T')[0]);
            expect(actual_response_find.data.prospect_identifiers[0].active_to).to.be.equal(null);
        }
           
    }else if(serviceName === 'find prospect'){
         //verify the elements 
            //verify prospect
            expect(actual_response_find.data.prospect[0].created_on.split('T')[0]).to.be.equal(responseToVerify.created_on.toISOString().split('T')[0]);
            expect(actual_response_find.data.prospect[0].prospect_id.toString()).to.be.equal(responseToVerify.prospectIDCreated);
            expect(actual_response_find.data.prospect[0].brand_identifier).to.be.equal(responseToVerify.brand_identifier);
            expect(actual_response_find.data.prospect[0].channel_identifier).to.be.equal(responseToVerify.channel_identifier);
            expect(actual_response_find.data.prospect[0].first_name).to.be.equal(responseToVerify.first_name);

            //verify prospect identifier

            expect(actual_response_find.data.prospect_identifier.length).to.be.equal(1); // always one identifier is present

            actual_response_find.data.prospect_identifier.forEach(element => {
                expect(element.prospect_identifier_id).to.not.be.equal(null);
                expect(element.prospect_id.toString()).to.be.equal(responseToVerify.prospectIDCreated);
                expect(element.active_from).to.not.be.equal(null);
                
                if(test_data === 'session id'){
                    expect(element.identifier).to.be.equal(responseToVerify.identifier.toString());
                    if(user_type === 'UNAUTH Customer'){
                        expect(element.identifier_type).to.be.equal('SessionId')
                    }else{
                        expect(element.identifier_type).to.be.equal('IBID')
                    }
                    expect(element.active_to.split('T')[0]).to.be.equal(responseToVerify.created_on.toISOString().split('T')[0]);
                }else if(test_data === 'new phone'){
                    expect(element.identifier).to.be.equal(responseToVerify.phone[responseToVerify.phone.length - 1]);
                    expect(element.identifier_type).to.be.equal('phone')
                    expect(element.active_to).to.be.equal(null);
                }else if(test_data === 'new mobile'){
                    expect(element.identifier).to.be.equal(responseToVerify.mobile[responseToVerify.mobile.length - 1]);
                    expect(element.identifier_type).to.be.equal('mobile')
                    expect(element.active_to).to.be.equal(null);
                }else if(test_data === 'new email'){
                    expect(element.identifier).to.be.equal(responseToVerify.email[responseToVerify.email.length - 1]);
                    expect(element.identifier_type).to.be.equal('email')
                    expect(element.active_to).to.be.equal(null);
                }else if(test_data === 'old phone'){
                    expect(element.identifier).to.be.equal(responseToVerify.phone[responseToVerify.phone.length - 2]);
                    expect(element.identifier_type).to.be.equal('phone')
                    expect(element.active_to.split('T')[0]).to.be.equal(responseToVerify.created_on.toISOString().split('T')[0]);
                }else if(test_data === 'old mobile'){
                    expect(element.identifier).to.be.equal(responseToVerify.mobile[responseToVerify.mobile.length - 2]);
                    expect(element.identifier_type).to.be.equal('mobile')
                    expect(element.active_to.split('T')[0]).to.be.equal(responseToVerify.created_on.toISOString().split('T')[0]);
                }else if(test_data === 'old email'){
                    expect(element.identifier).to.be.equal(responseToVerify.email[responseToVerify.email.length - 2]);
                    expect(element.identifier_type).to.be.equal('email')
                    expect(element.active_to.split('T')[0]).to.be.equal(responseToVerify.created_on.toISOString().split('T')[0]);
                }else{
                    throw `user type ${test_data} is not defined`
                }    
            })
    }else if(serviceName === 'create intent'){
        if(test_data === 'valid request'){
            const verification_object = {
                "prospect": [
                    {
                        "prospect_id": parseInt(responseToVerify.prospectIDCreated),
                        "created_on": responseToVerify.created_on.toISOString().split('T')[0],
                        "brand_identifier": responseToVerify.brand_identifier,
                        "channel_identifier": responseToVerify.channel_identifier,
                        "first_name": responseToVerify.first_name
                    }
                ],
                "intent": [
                    {
                        "intent_id": responseToVerify.intentIDCreated,
                        "prospect_id": parseInt(responseToVerify.prospectIDCreated),
                        "intent_questionaire_payload": responseToVerify.intentQuestionaiarPayload[responseToVerify.intentQuestionaiarPayload.length -1],
                        "active_from": responseToVerify.active_from_intent[responseToVerify.active_from_intent.length - 1].toISOString().split('T')[0],
                        "active_to": null
                    }
                ]
            }
            console.log("verification object is - ")
            //console.log(JSON.stringify(actual_response_find.data, null, 4))
            console.log(JSON.stringify(verification_object, null, 4))
            expect(actual_response_find.data).to.deep.equal(verification_object);
        }
    }
    else {
        throw `service name is not defined - ${serviceName}`;
    }
}


async function sleep(ms) {
    console.log(`sleeping for ${ms} ms`)
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  


module.exports = {createTestData, setDomusCookieValidatorMOC, validateResponse, validateResponseInDB, sleep}