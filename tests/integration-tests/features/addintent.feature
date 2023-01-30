
@Add-Intent
@api-test
Feature: Validate Add Intent API response


    @valid-scenarios
    Scenario Outline: A Intent is created and added to a prospect
        # Create a prospect to be updated
        Given Test data for "create prospect" is created as "new record with All fields"
        And MOC values are set wth user as "<USER_TYPE>"
        When A "post" request to "create prospect" is executed for "new record with All fields"
        Then Validate the response of "create prospect" for "new record with All fields" and "<USER_TYPE>"
        When A "prospect id" is created
        # Add Intent to a prospect
        When New "intent" is created as follows for "valid scenario"
            | field             | value                        |
            | CustomerIntention | Looking to by a new property |
            | FirstProperty     | No                           |
            | BuyingRediness    | Ready to buy in a month      |
            | NoOfApplicants    | 2                            |
            | Occupying         | single occupency             |
            | LBGMortgaged      | true                         |
            | RemoRediness      | false                        |
        When A "post" request to "create intent" is executed for ""
        Then Validate the response of "create intent" for "valid request" and "<USER_TYPE>"
        And A "intent id" is created
        #Find Intent with prospect ID
        And A "get" request to "find intent" is executed for ""
        And Validate the response of "create intent" for "valid request" and "<USER_TYPE>" in DB
        #Find Intent with prospect ID and Intent ID
        And A "get" request to "find intent by id" is executed for ""
        And Validate the response of "create intent" for "valid request" and "<USER_TYPE>" in DB
        # Add Intent again to the same prospect
        When A "post" request to "create intent" is executed for ""
        Then Validate the response of "create intent" for "duplicate request" and "<USER_TYPE>"
        # Add a different Intent again to the same prospect
        When New "intent" is created as follows for "valid scenario"
            | field             | value                        |
            | CustomerIntention | Looking to by a new property |
        When A "post" request to "create intent" is executed for ""
        Then Validate the response of "create intent" for "duplicate request" and "<USER_TYPE>"

        Examples:
            | USER_TYPE       |
            | UNAUTH Customer |
            | IB CUSTOMER     |


    @valid-scenarios
    Scenario Outline: A Intent with only one field is created and added to a prospect
        # Create a prospect to be updated
        Given Test data for "create prospect" is created as "new record with All fields"
        And MOC values are set wth user as "<USER_TYPE>"
        When A "post" request to "create prospect" is executed for "new record with All fields"
        Then Validate the response of "create prospect" for "new record with All fields" and "<USER_TYPE>"
        When A "prospect id" is created
        # Add Intent to a prospect
        When New "intent" is created as follows for "valid scenario"
            | field             | value                        |
            | CustomerIntention | Looking to by a new property |
        When A "post" request to "create intent" is executed for ""
        Then Validate the response of "create intent" for "valid request" and "<USER_TYPE>"
        And A "intent id" is created
        #Find Intent with prospect ID
        And A "get" request to "find intent" is executed for ""
        And Validate the response of "create intent" for "valid request" and "<USER_TYPE>" in DB
        #Find Intent with prospect ID and Intent ID
        And A "get" request to "find intent by id" is executed for ""
        And Validate the response of "create intent" for "valid request" and "<USER_TYPE>" in DB
        # Add Intent again to the same prospect
        When A "post" request to "create intent" is executed for ""
        Then Validate the response of "create intent" for "duplicate request" and "<USER_TYPE>"
        # Add a different Intent again to the same prospect
        When New "intent" is created as follows for "valid scenario"
            | field | value |
        When A "post" request to "create intent" is executed for ""
        Then Validate the response of "create intent" for "duplicate request" and "<USER_TYPE>"

        Examples:
            | USER_TYPE       |
            | UNAUTH Customer |
            | IB CUSTOMER     |

    
    @valid-scenarios
    Scenario Outline: A Intent with empty questionare payload is created and added to a prospect
        # Create a prospect to be updated
        Given Test data for "create prospect" is created as "new record with All fields"
        And MOC values are set wth user as "<USER_TYPE>"
        When A "post" request to "create prospect" is executed for "new record with All fields"
        Then Validate the response of "create prospect" for "new record with All fields" and "<USER_TYPE>"
        When A "prospect id" is created
        # Add Intent to a prospect
        When New "intent" is created as follows for "valid scenario"
            | field | value |
        When A "post" request to "create intent" is executed for ""
        Then Validate the response of "create intent" for "valid request" and "<USER_TYPE>"
        And A "intent id" is created
        #Find Intent with prospect ID
        And A "get" request to "find intent" is executed for ""
        And Validate the response of "create intent" for "valid request" and "<USER_TYPE>" in DB
        #Find Intent with prospect ID and Intent ID
        And A "get" request to "find intent by id" is executed for ""
        And Validate the response of "create intent" for "valid request" and "<USER_TYPE>" in DB
        # Add Intent again to the same prospect
        When A "post" request to "create intent" is executed for ""
        Then Validate the response of "create intent" for "duplicate request" and "<USER_TYPE>"
        When New "intent" is created as follows for "valid scenario"
            | field             | value                        |
            | CustomerIntention | Looking to by a new property |
            | FirstProperty     | No                           |
            | BuyingRediness    | Ready to buy in a month      |
            | NoOfApplicants    | 2                            |
            | Occupying         | single occupency             |
            | LBGMortgaged      | true                         |
            | RemoRediness      | false                        |
        When A "post" request to "create intent" is executed for ""
        Then Validate the response of "create intent" for "duplicate request" and "<USER_TYPE>"

        Examples:
            | USER_TYPE       |
            | UNAUTH Customer |
            | IB CUSTOMER     |


    @in-valid-scenarios
    Scenario Outline: A Intent is not created due to invalid payload body
        When New "intent" is created as follows for "<TEST_DATA>"
            | field | value |
        When A "post" request to "create intent" is executed for "<TEST_DATA>"
        Then Validate the response of "create intent" for "<TEST_DATA>" and "<USER_TYPE>"

        Examples:
            | USER_TYPE       | TEST_DATA                               |
            | UNAUTH Customer | without intent_questionaire_payload     |
            | UNAUTH Customer | without active_from                     |
            | UNAUTH Customer | active_from not as a valid string       |
            | UNAUTH Customer | active_from is a number                 |
            | UNAUTH Customer | intent_questionaire_payload is a number |
            | UNAUTH Customer | intent_questionaire_payload is a string |
            | UNAUTH Customer | invalid value of x-authorization-id     |
            | IB CUSTOMER     | without intent_questionaire_payload     |
            | IB CUSTOMER     | without active_from                     |
            | IB CUSTOMER     | active_from not as a valid string       |
            | IB CUSTOMER     | active_from is a number                 |
            | IB CUSTOMER     | intent_questionaire_payload is a number |
            | IB CUSTOMER     | intent_questionaire_payload is a string |
            | IB CUSTOMER     | invalid value of x-authorization-id     |


    @in-valid-scenarios
    Scenario Outline: A Intent is not created due to invalid value of prorspect id
        # Create a prospect to be updated
        Given Test data for "create prospect" is created as "new record with All fields"
        And MOC values are set wth user as "<USER_TYPE>"
        When A "post" request to "create prospect" is executed for "new record with All fields"
        Then Validate the response of "create prospect" for "new record with All fields" and "<USER_TYPE>"
        When A "prospect id" is created
        And The "prospect id" is updated to an invalid value
        # Add Intent to a prospect
        When New "intent" is created as follows for "valid scenario"
            | field             | value                        |
            | CustomerIntention | Looking to by a new property |
        When A "post" request to "create intent" is executed for ""
        Then Validate the response of "create intent" for "in-valid prospect id" and "<USER_TYPE>"

        Examples:
            | USER_TYPE       |
            | UNAUTH Customer |
            | IB CUSTOMER     |

    @in-valid-scenarios
    Scenario Outline: A Intent is not created due to invalid value of user type
        # Create a prospect to be updated
        Given Test data for "create prospect" is created as "new record with All fields"
        And MOC values are set wth user as "<USER_TYPE>"
        When A "post" request to "create prospect" is executed for "new record with All fields"
        Then Validate the response of "create prospect" for "new record with All fields" and "<USER_TYPE>"
        When A "prospect id" is created
        And The "prospect id" is updated to an invalid value
        # Add Intent to a prospect
        When New "intent" is created as follows for "valid scenario"
            | field             | value                        |
            | CustomerIntention | Looking to by a new property |
        And MOC values are set wth user as "<USER_TYPE_FOR_INTENT>"
        When A "post" request to "create intent" is executed for ""
        Then Validate the response of "create intent" for "in-valid user type" and "<USER_TYPE>"

        Examples:
            | USER_TYPE       | USER_TYPE_FOR_INTENT |
            | UNAUTH Customer | IB CUSTOMER          |
            | IB CUSTOMER     | UNAUTH Customer      |


