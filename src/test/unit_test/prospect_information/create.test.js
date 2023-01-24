
const supertest = require('supertest');
var app = require("../../main/app.js");
const CREATE_HELPER = require("../../main/helpers/prospect_information/create_helper");
PROSPECT_IDENTIFIER_HELPER = require("../../main/helpers/prospect-record/prospect_identifier_helper")
const domusCookie = require('../../main/helpers/domus/domusCookie');
PROSPECT_HELPER = require("../../main/helpers/prospect/prospect_helper")
INTENT_HELPER = require("../../main/helpers/intent/intent_helper")
const PROSPECT_INFORMATION_HELPER = require('../../main/helpers/prospect_information/prospect_info_helper');
const db = require('../../main/utils/azureSql');


const X_Auth_dummy = [
    {
        "userType": "UNAUTH_CUSTOMER",
        "sub": "10000121",
        "exp": 1666343413
    },
    {
        "userType": "IB_CUSTOMER",
        "sub": "123232330",
        "exp": 1666343413
    },
    {
        "userType": "Not_Unauth_or_IB",
        "sub": "123232330",
        "exp": 1666343413
    }
]


const dummy_response = [ 200,"message: PayloadId PL2 is created successfully"]
const xValidationdummyresponse= [ 200,"X_AUTH passes"]
const notFoundResponse = "{\"error\":\"ProspectId in the request is not associated with userType and sub\"}"
const doesNotExistResponse = "{\"error\":\"Prospect with userType and sub doesn't exist in the records\"}"
const notValidUserType = "{\"error\":\"Auth userType is not valid.\"}"
const prospect_doesnt_exist = "{\"error\":\"Prospect with ProspectId, does not exist in the Prospect table records.\"}"
const payload_created_dummy = "{\"message\":\"PayloadId PL2 is created successfully\"}"
const dummysub = "123232320";
const dummysub2 = "10000008";
const nulldummysub = null;


describe("Prospect Information", () =>{
    //create prospect
    describe("Create Prospect Information Record", () =>{
        //create prospect information when usertype is ok

        describe("Given the Usertype is valid but X_auth is missing ",() =>{

            it("Should return 400 and Prospect Information not created",async () =>{
                const {statusCode,res} = await supertest(app).post("/api/v1/prospect/10000008/save/").send();
                expect(statusCode).toBe(400)
            })
            })


        describe("Given the Usertype is valid but X_auth is not missing",() =>{

            it("Should return 200 and Prospect Information created",async () =>{
                
                const getResponseServiceMock = jest
                .spyOn(CREATE_HELPER,'getResponse')
                .mockReturnValueOnce(dummy_response);

                const getResponsePayloadMock = jest
                .spyOn(domusCookie,'getResponsePayload')
                .mockReturnValueOnce(dummy_response);

                const xAauthValidationMock = jest
                .spyOn(CREATE_HELPER,'xAauthValidation')
                .mockReturnValueOnce(xValidationdummyresponse);
                
                const {statusCode,res} = await supertest(app).post("/api/v1/prospect/10000008/save/").send();
                console.log(statusCode)
                expect(statusCode).toBe(200)
                expect(res.text).toEqual(dummy_response[1])
                expect(getResponseServiceMock).toHaveBeenCalled();
                expect(xAauthValidationMock).toHaveBeenCalled();

            })

            })



    describe("Depending on Usertype but prospectid from db doesnot match with prospectid by sessionid",() =>{

        if(X_Auth_dummy[0].userType=='UNAUTH_CUSTOMER' && dummysub!=10000008){
        it("Should return 404",async () =>{

            const xAauthValidationMock = jest
            .spyOn(CREATE_HELPER,'xAauthValidation')
            .mockReturnValueOnce(xValidationdummyresponse);

            const getResponsePayloadMock = jest
            .spyOn(domusCookie,'getResponsePayload')
            .mockReturnValueOnce(X_Auth_dummy[0]);
            
            const getProspectWithSessionIdMock = jest
            .spyOn(PROSPECT_IDENTIFIER_HELPER,'getProspectWithSessionId')
            .mockReturnValueOnce(dummysub);

            //Calling Create Intent function while taking prospectId = 10000008 as an example
            const {statusCode,res} = await supertest(app).post("/api/v1/prospect/10000008/save/").send();         
            expect(statusCode).toBe(404)
            expect(res.text).toEqual(notFoundResponse)
            expect(getProspectWithSessionIdMock).toHaveBeenCalled();
            expect(xAauthValidationMock).toHaveBeenCalled();

        })
    }
    
        if(X_Auth_dummy[0].userType=='UNAUTH_CUSTOMER' && dummysub2==10000008){
        it("Should return 400",async () =>{

            const xAauthValidationMock = jest
            .spyOn(CREATE_HELPER,'xAauthValidation')
            .mockReturnValueOnce(xValidationdummyresponse);

            const getResponsePayloadMock = jest
            .spyOn(domusCookie,'getResponsePayload')
            .mockReturnValueOnce(X_Auth_dummy[0]);
                
            const getProspectWithSessionIdMock = jest
            .spyOn(PROSPECT_IDENTIFIER_HELPER,'getProspectWithSessionId')
            .mockReturnValueOnce(dummysub2);
    
            const isProspectPresentMock = jest
            .spyOn(PROSPECT_HELPER,'isProspectPresent')
            .mockReturnValueOnce(false);

            const isProspectInfoPresentMock = jest
            .spyOn(PROSPECT_INFORMATION_HELPER,'isProspectInfoPresent')
            .mockReturnValueOnce(false);

            //Calling Create Intent function while taking prospectId = 10000008 as an example
            const {statusCode,res} = await supertest(app).post("/api/v1/prospect/10000008/save/").send();         
            expect(statusCode).toBe(400)
            expect(res.text).toEqual(prospect_doesnt_exist)
            expect(getProspectWithSessionIdMock).toHaveBeenCalled();
    
            })

        }

        if(X_Auth_dummy[0].userType=='UNAUTH_CUSTOMER' && dummysub2==10000008){
          it("Should return 200 and prospect info created",async () =>{
  
              const xAauthValidationMock = jest
              .spyOn(CREATE_HELPER,'xAauthValidation')
              .mockReturnValueOnce(xValidationdummyresponse);
  
              const getResponsePayloadMock = jest
              .spyOn(domusCookie,'getResponsePayload')
              .mockReturnValueOnce(X_Auth_dummy[0]);
                  
              const getProspectWithSessionIdMock = jest
              .spyOn(PROSPECT_IDENTIFIER_HELPER,'getProspectWithSessionId')
              .mockReturnValueOnce(dummysub2);
      
              const isProspectPresentMock = jest
              .spyOn(PROSPECT_HELPER,'isProspectPresent')
              .mockReturnValueOnce(true);

              const getNextPayloadIdMock = jest
              .spyOn(PROSPECT_INFORMATION_HELPER,'getNextPayloadId')
              .mockReturnValueOnce("PL2");
  
              const isProspectInfoPresentMock = jest
              .spyOn(PROSPECT_INFORMATION_HELPER,'isProspectInfoPresent')
              .mockReturnValueOnce(false);

              const insertRecordMock = jest
              .spyOn(db,'insertRecord')
              .mockReturnValueOnce()

              //Calling Create Intent function while taking prospectId = 10000008 as an example
              const {statusCode,res} = await supertest(app).post("/api/v1/prospect/10000008/save/").send();         
              expect(statusCode).toBe(200)
              expect(res.text).toEqual(payload_created_dummy)
              expect(getProspectWithSessionIdMock).toHaveBeenCalled();
      
              })
  
          }

        if(X_Auth_dummy[1].userType=='IB_CUSTOMER' && dummysub!=10000008){
            it("Should return 404",async () =>{
    
                const xAauthValidationMock = jest
                .spyOn(CREATE_HELPER,'xAauthValidation')
                .mockReturnValueOnce(xValidationdummyresponse);
    
                const getResponsePayloadMock = jest
                .spyOn(domusCookie,'getResponsePayload')
                .mockReturnValueOnce(X_Auth_dummy[1]);
                
                const getProspectWithIBIDIdMock = jest
                .spyOn(PROSPECT_IDENTIFIER_HELPER,'getProspectWithIBID')
                .mockReturnValueOnce(dummysub);
    
                //Calling Create Intent function while taking prospectId = 10000008 as an example
                const {statusCode,res} = await supertest(app).post("/api/v1/prospect/10000008/save/").send();         
                expect(statusCode).toBe(404)
                expect(res.text).toEqual(notFoundResponse)
                expect(getProspectWithIBIDIdMock).toHaveBeenCalled();
                expect(xAauthValidationMock).toHaveBeenCalled();
    
            })
        }
        
            if(X_Auth_dummy[1].userType=='IB_CUSTOMER' && dummysub2==10000008){
            it("Should return 400",async () =>{
    
                const xAauthValidationMock = jest
                .spyOn(CREATE_HELPER,'xAauthValidation')
                .mockReturnValueOnce(xValidationdummyresponse);
    
                const getResponsePayloadMock = jest
                .spyOn(domusCookie,'getResponsePayload')
                .mockReturnValueOnce(X_Auth_dummy[1]);
                    
                const getProspectWithIBIDIdMock = jest
                .spyOn(PROSPECT_IDENTIFIER_HELPER,'getProspectWithIBID')
                .mockReturnValueOnce(dummysub2);
        
                const isProspectPresentMock = jest
                .spyOn(PROSPECT_HELPER,'isProspectPresent')
                .mockReturnValueOnce(false);

                const isProspectInfoPresentMock = jest
                .spyOn(PROSPECT_INFORMATION_HELPER,'isProspectInfoPresent')
                .mockReturnValueOnce(false);

    
                //Calling Create Intent function while taking prospectId = 10000008 as an example
                const {statusCode,res} = await supertest(app).post("/api/v1/prospect/10000008/save/").send();         
                expect(statusCode).toBe(400)
                expect(res.text).toEqual(prospect_doesnt_exist)
                expect(getProspectWithIBIDIdMock).toHaveBeenCalled();
        
                })
    
            }

            if(X_Auth_dummy[1].userType=='IB_CUSTOMER' && dummysub2==10000008){
              it("Should return 200 and prospect info created",async () =>{
      
                  const xAauthValidationMock = jest
                  .spyOn(CREATE_HELPER,'xAauthValidation')
                  .mockReturnValueOnce(xValidationdummyresponse);
      
                  const getResponsePayloadMock = jest
                  .spyOn(domusCookie,'getResponsePayload')
                  .mockReturnValueOnce(X_Auth_dummy[1]);
                      
                  const getProspectWithIBIDIdMock = jest
                  .spyOn(PROSPECT_IDENTIFIER_HELPER,'getProspectWithIBID')
                  .mockReturnValueOnce(dummysub2);
          
                  const isProspectPresentMock = jest
                  .spyOn(PROSPECT_HELPER,'isProspectPresent')
                  .mockReturnValueOnce(true);
    
                  const getNextPayloadIdMock = jest
                  .spyOn(PROSPECT_INFORMATION_HELPER,'getNextPayloadId')
                  .mockReturnValueOnce("PL2");
      
                  const isProspectInfoPresentMock = jest
                  .spyOn(PROSPECT_INFORMATION_HELPER,'isProspectInfoPresent')
                  .mockReturnValueOnce(false);
    
                  const insertRecordMock = jest
                  .spyOn(db,'insertRecord')
                  .mockReturnValueOnce()
    
                  //Calling Create Intent function while taking prospectId = 10000008 as an example
                  const {statusCode,res} = await supertest(app).post("/api/v1/prospect/10000008/save/").send();         
                  expect(statusCode).toBe(200)
                  expect(res.text).toEqual(payload_created_dummy)
                  expect(getProspectWithIBIDIdMock).toHaveBeenCalled();
          
                  })
      
              }
        
            if(X_Auth_dummy[2].userType=='Not_Unauth_or_IB'){

                it("Should return 404 and Invalid Usertype",async () =>{

                    const xAauthValidationMock = jest
                    .spyOn(CREATE_HELPER,'xAauthValidation')
                    .mockReturnValueOnce(xValidationdummyresponse);
    
                    const getResponsePayloadMock = jest
                    .spyOn(domusCookie,'getResponsePayload')
                    .mockReturnValueOnce(X_Auth_dummy[2]);
    
                    const {statusCode,res} = await supertest(app).post("/api/v1/prospect/10000008/save/").send();
                    expect(statusCode).toBe(400)
                    expect(res.text).toEqual(notValidUserType)
                    expect(xAauthValidationMock).toHaveBeenCalled();
                    expect(getResponsePayloadMock).toHaveBeenCalled();
    
                })
            }
         })

        //Testing based on the usertype
        describe("Testing Based on Usertype",() =>{

            if(X_Auth_dummy[0].sub!=10000008){
                //prospectidfromdb is not equal to the prospectid from sessionid
                it("Should return 404 as prospectids do not match",async () =>{

                const xAauthValidationMock = jest
                .spyOn(CREATE_HELPER,'xAauthValidation')
                .mockReturnValueOnce(xValidationdummyresponse);

                const getResponsePayloadMock = jest
                .spyOn(domusCookie,'getResponsePayload')
                .mockReturnValueOnce(X_Auth_dummy[0]);
                
                const getProspectWithSessionIdMock = jest
                .spyOn(PROSPECT_IDENTIFIER_HELPER,'getProspectWithSessionId')
                .mockReturnValueOnce(X_Auth_dummy[0].sub);

                const {statusCode,res} = await supertest(app).post("/api/v1/prospect/10000008/save/").send();
                expect(statusCode).toBe(404)
                expect(res.text).toEqual(notFoundResponse)
                expect(getProspectWithSessionIdMock).toHaveBeenCalled();
                expect(xAauthValidationMock).toHaveBeenCalled();
                expect(getResponsePayloadMock).toHaveBeenCalled();

            })
        }
            
                //prospect with sub doesn't exist in the records
                it("Should return 404",async () =>{

                    const xAauthValidationMock = jest
                    .spyOn(CREATE_HELPER,'xAauthValidation')
                    .mockReturnValueOnce(xValidationdummyresponse);

                    const getResponsePayloadMock = jest
                    .spyOn(domusCookie,'getResponsePayload')
                    .mockReturnValueOnce(X_Auth_dummy[0]);

                    const getProspectWithSessionIdMock = jest
                    .spyOn(PROSPECT_IDENTIFIER_HELPER,'getProspectWithSessionId')
                    .mockReturnValueOnce(nulldummysub);
                    
                    const {statusCode,res} = await supertest(app).post("/api/v1/prospect/10000008/save/").send();
                    expect(statusCode).toBe(404)
                    expect(res.text).toEqual(doesNotExistResponse)
                    expect(xAauthValidationMock).toHaveBeenCalled();
                    expect(getResponsePayloadMock).toHaveBeenCalled();
        
                })

                it("Should return 404",async () =>{

                    const xAauthValidationMock = jest
                    .spyOn(CREATE_HELPER,'xAauthValidation')
                    .mockReturnValueOnce(xValidationdummyresponse);

                    const getResponsePayloadMock = jest
                    .spyOn(domusCookie,'getResponsePayload')
                    .mockReturnValueOnce(X_Auth_dummy[1]);

                    const getProspectWithIBIDIdMock = jest
                    .spyOn(PROSPECT_IDENTIFIER_HELPER,'getProspectWithIBID')
                    .mockReturnValueOnce(nulldummysub);
                    
                    const {statusCode,res} = await supertest(app).post("/api/v1/prospect/10000008/save/").send();
                    expect(statusCode).toBe(404)
                    expect(res.text).toEqual(doesNotExistResponse)
                    expect(xAauthValidationMock).toHaveBeenCalled();
                    expect(getResponsePayloadMock).toHaveBeenCalled();
        
                })
            
     })
})
})