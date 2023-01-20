# find by id is tested in detail with create and add prospect tests are will not be tested explictly
# find by is tested in this file

@findContact
@api-test
Feature: Validate Find Prospect Contact API response

    @valid-scenarios
    Scenario Outline: A Prospect is updated and new prospect contacts added in DB is tested using Find by service
        # Create a prospect to be updated
        Given Test data for "create prospect" is created as "<TEST_DATA_CREATE>"
        And MOC values are set wth user as "<USER_TYPE>"
        When A "post" request to "create prospect" is executed for "<TEST_DATA_CREATE>"
        Then Validate the response of "create prospect" for "<TEST_DATA_CREATE>" and "<USER_TYPE>"
        When A prospect id is created
        # Add/update prospect contact steps
        And Test data for "<API>" is created as "<TEST_DATA_ADD_AND_UPDATE>"
        And A "put" request to "<API>" is executed for "<TEST_DATA_ADD_AND_UPDATE>"
        And Make the thread to sleep for "10" seconds
        Then Validate the response of "<API>" for "<TEST_DATA_ADD_AND_UPDATE>" and "<USER_TYPE>"
        And A "get" request to "find prospect using prospect id" is executed for "<TEST_DATA_ADD_AND_UPDATE>"
        Then Validate the response of "<API>" for "<TEST_DATA_ADD_AND_UPDATE>" and "<USER_TYPE>" in DB
        # Add/update prospect contact steps - update the same again
        And Test data for "<API>" is created as "<TEST_DATA_ADD_AND_UPDATE>"
        And A "put" request to "<API>" is executed for "<TEST_DATA_ADD_AND_UPDATE>"
        And Make the thread to sleep for "10" seconds
        Then Validate the response of "<API>" for "<TEST_DATA_ADD_AND_UPDATE>" and "<USER_TYPE>"
        And A "get" request to "find prospect using prospect id" is executed for "<TEST_DATA_ADD_AND_UPDATE>"
        Then Validate the response of "<API>" for "<TEST_DATA_ADD_AND_UPDATE>" and "<USER_TYPE>" in DB
        # Find service
        And Test data for "find prospect" is created as "<TEST_DATA_FIND>"
        And A "post" request to "find prospect" is executed for "<TEST_DATA_FIND>"
        Then Validate the response of "find prospect" for "<TEST_DATA_FIND>" and "<USER_TYPE>"
        Then Validate the response of "find prospect" for "<TEST_DATA_FIND>" and "<USER_TYPE>" in DB

        Examples:
            | API                                    | USER_TYPE       | TEST_DATA_CREATE           | TEST_DATA_ADD_AND_UPDATE                     | TEST_DATA_FIND |
            | add prospect contact using prospect id | UNAUTH Customer | new record with All fields | update both prospect and prospect identifier | session id     |
            | add prospect contact using prospect id | UNAUTH Customer | new record with All fields | update both prospect and prospect identifier | new phone      |
            | add prospect contact using prospect id | UNAUTH Customer | new record with All fields | update both prospect and prospect identifier | new mobile     |
            | add prospect contact using prospect id | UNAUTH Customer | new record with All fields | update both prospect and prospect identifier | new email      |
            | add prospect contact using prospect id | UNAUTH Customer | new record with All fields | update both prospect and prospect identifier | old phone      |
            | add prospect contact using prospect id | UNAUTH Customer | new record with All fields | update both prospect and prospect identifier | old mobile     |
            | add prospect contact using prospect id | UNAUTH Customer | new record with All fields | update both prospect and prospect identifier | old email      |
            | add prospect contact using prospect id | IB CUSTOMER     | new record with All fields | update both prospect and prospect identifier | session id     |
            | add prospect contact using prospect id | IB CUSTOMER     | new record with All fields | update both prospect and prospect identifier | new phone      |
            | add prospect contact using prospect id | IB CUSTOMER     | new record with All fields | update both prospect and prospect identifier | new mobile     |
            | add prospect contact using prospect id | IB CUSTOMER     | new record with All fields | update both prospect and prospect identifier | new email      |
            | add prospect contact using prospect id | IB CUSTOMER     | new record with All fields | update both prospect and prospect identifier | old phone      |
            | add prospect contact using prospect id | IB CUSTOMER     | new record with All fields | update both prospect and prospect identifier | old mobile     |
            | add prospect contact using prospect id | IB CUSTOMER     | new record with All fields | update both prospect and prospect identifier | old email      |

    @in-valid-scenarios
    Scenario Outline: Prospect not found in DB
        # Create a prospect to be updated
        Given Test data for "create prospect" is created as "new record with All fields"
        And MOC values are set wth user as "<USER_TYPE>"
        When A "post" request to "create prospect" is executed for "new record with All fields"
        Then Validate the response of "create prospect" for "new record with All fields" and "<USER_TYPE>"
        When A prospect id is created
        # Add/update prospect contact steps
        And Test data for "add prospect contact using prospect id" is created as "update both prospect and prospect identifier"
        And A "put" request to "add prospect contact using prospect id" is executed for "update both prospect and prospect identifier"
        And Make the thread to sleep for "10" seconds
        Then Validate the response of "add prospect contact using prospect id" for "update both prospect and prospect identifier" and "<USER_TYPE>"
        And A "get" request to "find prospect using prospect id" is executed for "update both prospect and prospect identifier"
        Then Validate the response of "add prospect contact using prospect id" for "update both prospect and prospect identifier" and "<USER_TYPE>" in DB
        # Add/update prospect contact steps - update the same again
        And Test data for "add prospect contact using prospect id" is created as "update both prospect and prospect identifier"
        And A "put" request to "add prospect contact using prospect id" is executed for "update both prospect and prospect identifier"
        And Make the thread to sleep for "10" seconds
        Then Validate the response of "add prospect contact using prospect id" for "update both prospect and prospect identifier" and "<USER_TYPE>"
        And A "get" request to "find prospect using prospect id" is executed for "update both prospect and prospect identifier"
        Then Validate the response of "add prospect contact using prospect id" for "update both prospect and prospect identifier" and "<USER_TYPE>" in DB
        # Find service
        And Test data for "find prospect" is created as "<TEST_DATA_FIND>"
        And MOC values are set wth user as "<UPDATED_USER_TYPE>"
        And A "post" request to "find prospect" is executed for "<TEST_DATA_FIND>"
        Then Validate the response of "find prospect" for "<TEST_DATA_FIND>" and "<USER_TYPE>"

        Examples:
            | USER_TYPE       | TEST_DATA_FIND               | UPDATED_USER_TYPE |
            | UNAUTH Customer | x-auth-value is not valid    | IB CUSTOMER       |
            | IB CUSTOMER     | x-auth-value is not valid    | UNAUTH Customer   |
            | UNAUTH Customer | Invalid-request-wrong-values | UNAUTH Customer   |
            | IB CUSTOMER     | Invalid-request-wrong-values | IB CUSTOMER       |

    @in-valid-scenarios
    Scenario Outline: Prospect not retrieved due to invalid conditions
        # Find service
        Given Test data for "find prospect" is created as "<TEST_DATA_FIND>"
        And MOC values are set wth user as "<USER_TYPE>"
        And A "post" request to "find prospect" is executed for "<TEST_DATA_FIND>"
        Then Validate the response of "find prospect" for "<TEST_DATA_FIND>" and "<USER_TYPE>"

        Examples:
            | USER_TYPE       | TEST_DATA_FIND                      |
            | UNAUTH Customer | IdentifierType not sent in request  |
            | UNAUTH Customer | IdentifierType is not a string      |
            | UNAUTH Customer | IdentifierValue not sent in request |
            | UNAUTH Customer | IdentifierValue is not a string     |
            | UNAUTH Customer | Empty Request Body                  |
            | UNAUTH Customer | Values not sent as String           |
            | UNAUTH Customer | invalid value of x-authorization-id |
            | IB CUSTOMER     | IdentifierType not sent in request  |
            | IB CUSTOMER     | IdentifierType is not a string      |
            | IB CUSTOMER     | IdentifierValue not sent in request |
            | IB CUSTOMER     | IdentifierValue is not a string     |
            | IB CUSTOMER     | Empty Request Body                  |
            | IB CUSTOMER     | Values not sent as String           |
            | IB CUSTOMER     | invalid value of x-authorization-id |

    
    @in-valid-scenarios
    Scenario Outline: Prospect not retrieved due to invalid conditions - Find by ID
        # Find service
        Given MOC values are set wth user as "<USER_TYPE>"
        And A "get" request to "find prospect using prospect id" is executed for "<TEST_DATA_FIND>"
        Then Validate the response of "find prospect using prospect id" for "<TEST_DATA_FIND>" and "<USER_TYPE>"

        Examples:
            | USER_TYPE       | TEST_DATA_FIND                      |
            | UNAUTH Customer | invalid value of x-authorization-id |
            | IB CUSTOMER     | invalid value of x-authorization-id |
