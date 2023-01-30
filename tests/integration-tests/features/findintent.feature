# This feature tests both Find Intent by Prospect ID and Find Intent by Prospect and Intent ID
# Valid scenarios are covered with Add / Update Intent
# This feature would mainly cover in-valid scenarios

@Find-Intent
@api-test
@run
Feature: Validate Add Intent API response


    @in-valid-scenarios
    Scenario Outline: Intent added to the prospect is not found due to invalid user-type
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
        # Check that the intent is created successfully
        # Find Intent with prospect ID
        And A "get" request to "find intent" is executed for ""
        And Validate the response of "create intent" for "valid request" and "<USER_TYPE>" in DB
        #Find Intent with prospect ID and Intent ID
        And A "get" request to "find intent by id" is executed for ""
        And Validate the response of "create intent" for "valid request" and "<USER_TYPE>" in DB
        # Actual start of tests
        # Update the user type in the domus mock
        And MOC values are set wth user as "<USER_TYPE_UPDATE>"
        # Find Intent with prospect ID
        And A "get" request to "find intent" is executed for ""
        Then Validate the response of "find intent" for "in-valid user type" and ""
        # Find Intent with prospect ID and Intent ID
        And A "get" request to "find intent by id" is executed for ""
        Then Validate the response of "find intent by id" for "in-valid user type" and ""

        Examples:
            | USER_TYPE       | USER_TYPE_UPDATE |
            | UNAUTH Customer | IB CUSTOMER      |
            | IB CUSTOMER     | UNAUTH Customer  |

    
    @in-valid-scenarios
    Scenario Outline: Intent added to the prospect is not found due to invalid prospect ID
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
        # Check that the intent is created successfully
        # Find Intent with prospect ID
        And A "get" request to "find intent" is executed for ""
        And Validate the response of "create intent" for "valid request" and "<USER_TYPE>" in DB
        #Find Intent with prospect ID and Intent ID
        And A "get" request to "find intent by id" is executed for ""
        And Validate the response of "create intent" for "valid request" and "<USER_TYPE>" in DB
        # Actual start of tests
        And The "prospect id" is updated to an invalid value
        # Find Intent with prospect ID
        And A "get" request to "find intent" is executed for ""
        Then Validate the response of "find intent" for "invalid prospect id" and ""
        # Find Intent with prospect ID and Intent ID
        And A "get" request to "find intent by id" is executed for ""
        Then Validate the response of "find intent by id" for "invalid prospect id" and ""

        Examples:
            | USER_TYPE       |
            | UNAUTH Customer |
            | IB CUSTOMER     |

    
    @in-valid-scenarios
    Scenario Outline: Intent not found due becaues it wasn't added to the Prospect
        # Create a prospect to be updated
        Given Test data for "create prospect" is created as "new record with All fields"
        And MOC values are set wth user as "<USER_TYPE>"
        When A "post" request to "create prospect" is executed for "new record with All fields"
        Then Validate the response of "create prospect" for "new record with All fields" and "<USER_TYPE>"
        When A "prospect id" is created
        # Actual start of tests
        # Find Intent with prospect ID
        And A "get" request to "find intent" is executed for ""
        Then Validate the response of "find intent" for "intent not found" and ""
        # Find Intent with prospect ID and Intent ID
        And A "get" request to "find intent by id" is executed for ""
        Then Validate the response of "find intent by id" for "intent not found" and ""

        Examples:
            | USER_TYPE       |
            | UNAUTH Customer |
            | IB CUSTOMER     |


    @in-valid-scenarios
    Scenario Outline: Intent added to the prospect is not found due to invalid intent ID
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
        # Check that the intent is created successfully
        # Find Intent with prospect ID
        And A "get" request to "find intent" is executed for ""
        And Validate the response of "create intent" for "valid request" and "<USER_TYPE>" in DB
        #Find Intent with prospect ID and Intent ID
        And A "get" request to "find intent by id" is executed for ""
        And Validate the response of "create intent" for "valid request" and "<USER_TYPE>" in DB
        # Actual start of tests
        And The "intent id" is updated to an invalid value
        # Find Intent with prospect ID and Intent ID
        And A "get" request to "find intent by id" is executed for ""
        Then Validate the response of "find intent by id" for "invalid intent id" and ""

        Examples:
            | USER_TYPE       |
            | UNAUTH Customer |
            | IB CUSTOMER     |


    @in-valid-scenarios
    Scenario Outline: Intent added to the prospect is not found due to x-authorization value not provided
        Given MOC values are set wth user as "<USER_TYPE>"
        When A "get" request to "find intent" is executed for "invalid value of x-authorization-id"
        Then Validate the response of "find intent" for "invalid value of x-authorization-id" and ""
        # Find Intent with prospect ID and Intent ID
        Given A "get" request to "find intent by id" is executed for "invalid value of x-authorization-id"
        Then Validate the response of "find intent by id" for "invalid value of x-authorization-id" and ""

        Examples:
            | USER_TYPE       |
            | UNAUTH Customer |
            | IB CUSTOMER     |
    