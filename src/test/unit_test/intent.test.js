const ProspectService = require("../../main/controller/prospectController");
const supertest = require('supertest');
var app = require("../../main/app.js");
const CREATE_HELPER = require("../../main/helpers/intent/create_helper");
PROSPECT_IDENTIFIER_HELPER = require("../../main/helpers/prospect-record/prospect_identifier_helper")
const { intentRoutes } = require('../../main/route/intent_route.js');
const X_Auth = require("../../main/variables/x-authorisation.json");
PROSPECT_HELPER = require("../../main/helpers/prospect/prospect_helper")
INTENT_HELPER = require("../../main/helpers/intent/intent_helper")
db = require('../../main/utils/azureSql');


const dummyprospectId = 10000001;
const dummyprospectIdentifierId = 'PID1';
const dummy_response = [ 200,"message: ProspectId is created successfully"]
const xValidationdummyresponse= [ 200,"X_AUTH passes"]
const notFoundResponse = "{\"error\":\"ProspectId in the request is not associated with userType and sub\"}"
const dummy_response_prospect_exist = "{\"message\":\"ProspectId, already exist in the system.\"}"
const dummysub = "123232320";
const dummysub2 = "10000008";
const nulldummysub = null;


describe("Intent", () =>{
    //create prospect
    describe("Create Intent", () =>{
        //create prospect when usertype is ok

        // describe("Given the Usertype is valid but X_auth is missing ",() =>{

        //     it("Should return 400 and Intent not created",async () =>{
        //         const {statusCode,res} = await supertest(app).post("/api/v1/prospect/10000008/intent/").send();
        //         expect(statusCode).toBe(400)

        //     })

        //     })


        // describe("Given the Usertype is valid but X_auth is not missing",() =>{

        //     it("Should return 200 and intent created",async () =>{
                
        //         const getResponseServiceMock = jest
        //         .spyOn(CREATE_HELPER,'getResponse')
        //         .mockReturnValueOnce(dummy_response);

        //         const xAauthValidationMock = jest
        //         .spyOn(CREATE_HELPER,'xAauthValidation')
        //         .mockReturnValueOnce(xValidationdummyresponse);
                
        //         const {statusCode,res} = await supertest(app).post("/api/v1/prospect/10000008/intent/").send();
        //         console.log(statusCode)
        //         expect(statusCode).toBe(200)
        //         expect(res.text).toEqual(dummy_response[1])
        //         expect(getResponseServiceMock).toHaveBeenCalled();
        //         expect(xAauthValidationMock).toHaveBeenCalled();

        //     })

        //     })

        

    //     //testing create function as a whole
    //     describe("everything valid inside create method",() =>{

    //         it("return max prospect",async () =>{

    //             const getProspectWithSessionIdMock = jest
    //             .spyOn(PROSPECT_IDENTIFIER_HELPER,'getProspectWithSessionId')
    //             .mockReturnValueOnce(nulldummysub);

    //             const getMaxProspectIdMock = jest
    //             .spyOn(PROSPECT_HELPER,'getMaxProspectId')
    //             .mockReturnValueOnce(dummyprospectId);

    //             const insertRecordMock = jest
    //             .spyOn(db,'insertRecord')
    //             .mockReturnValueOnce().mockReturnValueOnce();
                
    //             const getMaxProspectIdenIdMock = jest
    //             .spyOn(PROSPECT_IDENTIFIER_HELPER,'getMaxProspectIdenId')
    //             .mockReturnValueOnce(dummyprospectIdentifierId);

    //             const xAauthValidationMock = jest
    //             .spyOn(CREATE_HELPER,'xAauthValidation')
    //             .mockReturnValueOnce(xValidationdummyresponse);


    //             const {statusCode,res} = await supertest(app).post("/api/v1/prospect/").send();
    //             //console.log(statusCode, res)
    //             expect(statusCode).toBe(200)
    //             //expect(res.text).toEqual(dummy_response[1])
    //             //expect(getResponseServiceMock).toHaveBeenCalled();
    //         })
    
    //     })


    describe("Depending onUsertype but prospectid from db doesnot match with prospectid by sessionid",() =>{

        if(X_Auth[0].userType=='UNAUTH_CUSTOMER' && dummysub!=10000008){
        it("Should return 404",async () =>{

            const xAauthValidationMock = jest
            .spyOn(CREATE_HELPER,'xAauthValidation')
            .mockReturnValueOnce(xValidationdummyresponse);
            
            const getProspectWithSessionIdMock = jest
            .spyOn(PROSPECT_IDENTIFIER_HELPER,'getProspectWithSessionId')
            .mockReturnValueOnce(dummysub);

            //Calling Create Intent function while taking prospectId = 10000008 as an example
            const {statusCode,res} = await supertest(app).post("/api/v1/prospect/10000008/intent/").send();         
            expect(statusCode).toBe(404)
            expect(res.text).toEqual(notFoundResponse)
            expect(getProspectWithSessionIdMock).toHaveBeenCalled();
            expect(xAauthValidationMock).toHaveBeenCalled();

        })
    }else if(X_Auth[0].userType=='UNAUTH_CUSTOMER' && dummysub2==10000008){

        it("Should return ",async () =>{

            const xAauthValidationMock = jest
            .spyOn(CREATE_HELPER,'xAauthValidation')
            .mockReturnValueOnce(xValidationdummyresponse);
                
            const getProspectWithIBIDMock = jest
            .spyOn(PROSPECT_IDENTIFIER_HELPER,'getProspectWithIBID')
            .mockReturnValueOnce(dummysub);
    
            //var isprospectpresent = await PROSPECT_HELPER.isProspectPresent(req.params.ProspectId);
            //var isintentpresent = await INTENT_HELPER.isIntentPresent(req.params.ProspectId);
            //yahan pe extra jo functions hain unko karo mock

            const isProspectPresentMock = jest
            .spyOn(PROSPECT_HELPER,'getProspectWithIBID')
            .mockReturnValueOnce(true);

            const isIntentPresentMock = jest
            .spyOn(INTENT_HELPER,'getProspectWithIBID')
            .mockReturnValueOnce(false);


            //Calling Create Intent function while taking prospectId = 10000008 as an example
            const {statusCode,res} = await supertest(app).post("/api/v1/prospect/10000008/intent/").send();         
            expect(statusCode).toBe(404)
            expect(res.text).toEqual(notFoundResponse)
            expect(getProspectWithIBIDMock).toHaveBeenCalled();
            expect(xAauthValidationMock).toHaveBeenCalled();
    
            })

        
    }else if(X_Auth[0].userType=='IB_CUSTOMER' && dummysub!=10000008){

        it("Should return 404",async () =>{

            const xAauthValidationMock = jest
            .spyOn(CREATE_HELPER,'xAauthValidation')
            .mockReturnValueOnce(xValidationdummyresponse);
            
            const getProspectWithIBIDMock = jest
            .spyOn(PROSPECT_IDENTIFIER_HELPER,'getProspectWithIBID')
            .mockReturnValueOnce(dummysub);

            //Calling Create Intent function while taking prospectId = 10000008 as an example
            const {statusCode,res} = await supertest(app).post("/api/v1/prospect/10000008/intent/").send();         
            expect(statusCode).toBe(404)
            expect(res.text).toEqual(notFoundResponse)
            expect(getProspectWithIBIDMock).toHaveBeenCalled();
            expect(xAauthValidationMock).toHaveBeenCalled();

        })

    }else if(X_Auth[0].userType=='IB_CUSTOMER' && dummysub2==10000008){

    }else{
        //usertype is invalid
    }
        })

        //Testing based on the usertype
    //     describe("Testing Based on Usertype",() =>{

    //         if(X_Auth[0].userType=='UNAUTH_CUSTOMER'){

    //             it("Should return 200",async () =>{

    //             const xAauthValidationMock = jest
    //             .spyOn(CREATE_HELPER,'xAauthValidation')
    //             .mockReturnValueOnce(xValidationdummyresponse);
                
    //             const getProspectWithSessionIdMock = jest
    //             .spyOn(PROSPECT_IDENTIFIER_HELPER,'getProspectWithSessionId')
    //             .mockReturnValueOnce(dummysub);

    //             const {statusCode,res} = await supertest(app).post("/api/v1/prospect/10000008/intent/").send();
    //             expect(res.text).toEqual(dummy_response_prospect_exist)
    //             expect(getProspectWithSessionIdMock).toHaveBeenCalled();

    //         })
    //         }else if(X_Auth[0].userType=='IB_CUSTOMER'){

    //             it("Should return 200",async () =>{

    //                 const xAauthValidationMock = jest
    //                 .spyOn(CREATE_HELPER,'xAauthValidation')
    //                 .mockReturnValueOnce(xValidationdummyresponse);
                    
    //                 const getProspectWithIBIDIdMock = jest
    //                 .spyOn(PROSPECT_IDENTIFIER_HELPER,'getProspectWithIBID')
    //                 .mockReturnValueOnce(dummysub);

    //                 const {statusCode, res} = await supertest(app).post("/api/v1/prospect/").send();
    //                 expect(statusCode).toBe(200)
    //                 expect(res.text).toEqual(dummy_response_prospect_exist)
    //                 expect(getProspectWithIBIDIdMock).toHaveBeenCalled();
        
    //             })

    //         }else{

    //             it("Should return 400",async () =>{

    //                 const xAauthValidationMock = jest
    //                 .spyOn(CREATE_HELPER,'xAauthValidation')
    //                 .mockReturnValueOnce(xValidationdummyresponse);
                    
    //                 const getProspectWithIBIDIdMock = jest
    //                 .spyOn(PROSPECT_IDENTIFIER_HELPER,'getProspectWithIBID')
    //                 .mockReturnValueOnce(dummysub);

    //                 const {statusCode} = await supertest(app).post("/api/v1/prospect/").send();
    //                 expect(statusCode).toBe(400);
        
    //             })

    //         }
    // })
})
})