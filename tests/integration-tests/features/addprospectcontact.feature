@addProspectContact
@api-test
Feature: Validate Add Prospect Contact API response

    @valid-scenarios
    Scenario Outline: A Prospect is updated and new prospect contacts added in DB
        # Create a prospect to be updated
        Given Test data for "create prospect" is created as "<TEST_DATA_CREATE>"
        And MOC values are set wth user as "<USER_TYPE>"
        When A "post" request to "create prospect" is executed for "<TEST_DATA_CREATE>"
        Then Validate the response of "create prospect" for "<TEST_DATA_CREATE>" and "<USER_TYPE>"
        When A "prospect id" is created
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

        Examples:
            | API                                    | USER_TYPE       | TEST_DATA_CREATE                       | TEST_DATA_ADD_AND_UPDATE                     |
            | add prospect contact using prospect id | UNAUTH Customer | new record with All fields             | update prospect only                         |
            | add prospect contact using prospect id | UNAUTH Customer | new record with All fields             | update prospect identifier only              |
            | add prospect contact using prospect id | UNAUTH Customer | new record with All fields             | update both prospect and prospect identifier |
            | add prospect contact using prospect id | IB CUSTOMER     | new record with All fields             | update prospect only                         |
            | add prospect contact using prospect id | IB CUSTOMER     | new record with All fields             | update prospect identifier only              |
            | add prospect contact using prospect id | IB CUSTOMER     | new record with All fields             | update both prospect and prospect identifier |
            | add prospect contact using prospect id | UNAUTH Customer | new recored with only mandatory fields | update prospect only                         |
            | add prospect contact using prospect id | UNAUTH Customer | new recored with only mandatory fields | update prospect identifier only              |
            | add prospect contact using prospect id | UNAUTH Customer | new recored with only mandatory fields | update both prospect and prospect identifier |
            | add prospect contact using prospect id | IB CUSTOMER     | new recored with only mandatory fields | update prospect only                         |
            | add prospect contact using prospect id | IB CUSTOMER     | new recored with only mandatory fields | update prospect identifier only              |
            | add prospect contact using prospect id | IB CUSTOMER     | new recored with only mandatory fields | update both prospect and prospect identifier |
            # add prospect
            | add prospect contact                   | UNAUTH Customer | new record with All fields             | update prospect only                         |
            | add prospect contact                   | UNAUTH Customer | new record with All fields             | update prospect identifier only              |
            | add prospect contact                   | UNAUTH Customer | new record with All fields             | update both prospect and prospect identifier |
            | add prospect contact                   | IB CUSTOMER     | new record with All fields             | update prospect only                         |
            | add prospect contact                   | IB CUSTOMER     | new record with All fields             | update prospect identifier only              |
            | add prospect contact                   | IB CUSTOMER     | new record with All fields             | update both prospect and prospect identifier |
            | add prospect contact                   | UNAUTH Customer | new recored with only mandatory fields | update prospect only                         |
            | add prospect contact                   | UNAUTH Customer | new recored with only mandatory fields | update prospect identifier only              |
            | add prospect contact                   | UNAUTH Customer | new recored with only mandatory fields | update both prospect and prospect identifier |
            | add prospect contact                   | IB CUSTOMER     | new recored with only mandatory fields | update prospect only                         |
            | add prospect contact                   | IB CUSTOMER     | new recored with only mandatory fields | update prospect identifier only              |
            | add prospect contact                   | IB CUSTOMER     | new recored with only mandatory fields | update both prospect and prospect identifier |


    @in-valid-scenarios
    Scenario Outline: Scenario Outline name: A Prospect is not updated and new prospect contacts are not added in DB due to invalid user type
        # Add/update prospect contact steps
        Given MOC values are set wth user as "UNNAUTH Customer"
        And Test data for "<API>" is created as "update both prospect and prospect identifier"
        And A "put" request to "<API>" is executed for "update both prospect and prospect identifier"
        Then Validate the response of "<API>" for "in-valid user" and "UNNAUTH Customer"

        Examples:
            | API                                    |
            | add prospect contact using prospect id |
            # add prospect
            | add prospect contact                   |

    @in-valid-scenarios
    Scenario Outline: A Prospect is not updated and new prospect contacts are not added in DB due to invalid identifier
        # Add/update prospect contact steps
        Given MOC values are set wth user as "<USER_TYPE>"
        And Test data for "<API>" is created as "update both prospect and prospect identifier"
        And A "put" request to "<API>" is executed for "update both prospect and prospect identifier"
        Then Validate the response of "<API>" for "in-valid identifier" and "<USER_TYPE>"

        Examples:
            | API                                    | USER_TYPE       |
            | add prospect contact using prospect id | UNAUTH Customer |
            | add prospect contact using prospect id | IB CUSTOMER     |
            # add prospect
            | add prospect contact                   | UNAUTH Customer |
            | add prospect contact                   | IB CUSTOMER     |

    @in-valid-scenarios
    Scenario Outline: A Prospect is not updated and new prospect contacts are not added in DB due to invalid value of prospect id
        # Add/update prospect contact steps
        Given Test data for "create prospect" is created as "new record with All fields"
        And MOC values are set wth user as "<USER_TYPE>"
        When A "post" request to "create prospect" is executed for "new record with All fields"
        Then Validate the response of "create prospect" for "new record with All fields" and "<USER_TYPE>"
        When A "prospect id" is created
        And The "prospect id" is updated to an invalid value
        And Test data for "<API>" is created as "update both prospect and prospect identifier"
        And A "put" request to "<API>" is executed for "new record with All fields"
        Then Validate the response of "<API>" for "in-valid prospect id" and "<USER_TYPE>"

        Examples:
            | API                                    | USER_TYPE       |
            | add prospect contact using prospect id | UNAUTH Customer |
            | add prospect contact using prospect id | IB CUSTOMER     |
    # add prospect are not applicable as we are not sending prospect ID


    @in-valid-scenarios
    Scenario Outline: A Prospect is not updated and new prospect contacts are not added in DB due to invalid payload body
        # Add/update prospect contact steps
        Given MOC values are set wth user as "<USER_TYPE>"
        Given Test data for "<API>" is created as "<TEST_DATA_ADD_AND_UPDATE>"
        And A "put" request to "<API>" is executed for "<TEST_DATA_ADD_AND_UPDATE>"
        Then Validate the response of "<API>" for "<TEST_DATA_ADD_AND_UPDATE>" and "<USER_TYPE>"

        Examples:
            | API                                    | USER_TYPE       | TEST_DATA_ADD_AND_UPDATE             |
            | add prospect contact using prospect id | UNAUTH Customer | Body is not an array                 |
            | add prospect contact using prospect id | UNAUTH Customer | Body has and empty array             |
            | add prospect contact using prospect id | UNAUTH Customer | Empty body in an array               |
            | add prospect contact using prospect id | UNAUTH Customer | IdentifierType not provided in body  |
            | add prospect contact using prospect id | UNAUTH Customer | IdentifierType is a number           |
            | add prospect contact using prospect id | UNAUTH Customer | IdentifierValue not provided in body |
            | add prospect contact using prospect id | UNAUTH Customer | IdentifierValue is a number          |
            | add prospect contact using prospect id | UNAUTH Customer | ActiveFrom not provided in body      |
            | add prospect contact using prospect id | UNAUTH Customer | ActiveFrom is a invalid date string  |
            | add prospect contact using prospect id | UNAUTH Customer | invalid value of x-authorization-id  |
            | add prospect contact using prospect id | IB CUSTOMER     | Body is not an array                 |
            | add prospect contact using prospect id | IB CUSTOMER     | Body has and empty array             |
            | add prospect contact using prospect id | IB CUSTOMER     | Empty body in an array               |
            | add prospect contact using prospect id | IB CUSTOMER     | IdentifierType not provided in body  |
            | add prospect contact using prospect id | IB CUSTOMER     | IdentifierType is a number           |
            | add prospect contact using prospect id | IB CUSTOMER     | IdentifierValue not provided in body |
            | add prospect contact using prospect id | IB CUSTOMER     | IdentifierValue is a number          |
            | add prospect contact using prospect id | IB CUSTOMER     | ActiveFrom not provided in body      |
            | add prospect contact using prospect id | IB CUSTOMER     | ActiveFrom is a invalid date string  |
            | add prospect contact using prospect id | IB CUSTOMER     | invalid value of x-authorization-id  |
            # add prospect contact
            | add prospect contact                   | UNAUTH Customer | Body is not an array                 |
            | add prospect contact                   | UNAUTH Customer | Body has and empty array             |
            | add prospect contact                   | UNAUTH Customer | Empty body in an array               |
            | add prospect contact                   | UNAUTH Customer | IdentifierType not provided in body  |
            | add prospect contact                   | UNAUTH Customer | IdentifierType is a number           |
            | add prospect contact                   | UNAUTH Customer | IdentifierValue not provided in body |
            | add prospect contact                   | UNAUTH Customer | IdentifierValue is a number          |
            | add prospect contact                   | UNAUTH Customer | ActiveFrom not provided in body      |
            | add prospect contact                   | UNAUTH Customer | ActiveFrom is a invalid date string  |
            | add prospect contact                   | UNAUTH Customer | invalid value of x-authorization-id  |
            | add prospect contact                   | IB CUSTOMER     | Body is not an array                 |
            | add prospect contact                   | IB CUSTOMER     | Body has and empty array             |
            | add prospect contact                   | IB CUSTOMER     | Empty body in an array               |
            | add prospect contact                   | IB CUSTOMER     | IdentifierType not provided in body  |
            | add prospect contact                   | IB CUSTOMER     | IdentifierType is a number           |
            | add prospect contact                   | IB CUSTOMER     | IdentifierValue not provided in body |
            | add prospect contact                   | IB CUSTOMER     | IdentifierValue is a number          |
            | add prospect contact                   | IB CUSTOMER     | ActiveFrom not provided in body      |
            | add prospect contact                   | IB CUSTOMER     | ActiveFrom is a invalid date string  |
            | add prospect contact                   | IB CUSTOMER     | invalid value of x-authorization-id  |
