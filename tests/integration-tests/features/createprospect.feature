@createProspect
@api-test
Feature: Validate Create Prospect API response

	@run-tests
	@valid-scenarios
	Scenario Outline: A new Prospect is created in DB
		Given Test data for "create prospect" is created as "<TEST_DATA>"
		And The header values are set with user as "<USER_TYPE>"
		When A "post" request to "create prospect" is executed for "<TEST_DATA>"
		Then Validate the response of "create prospect" for "<TEST_DATA>" and "<USER_TYPE>"
		When A "prospect id" is created
		And A "get" request to "find prospect using prospect id" is executed for "<TEST_DATA>"
		Then Validate the response of "create prospect" for "<TEST_DATA>" and "<USER_TYPE>" in DB

		Examples:
			| USER_TYPE       | TEST_DATA                              |
			| UNAUTH Customer | new record with All fields             |
			| UNAUTH Customer | new recored with only mandatory fields |
			| UNAUTH Customer | new recored without first_name         |
			| UNAUTH Customer | new record without channel_identifier  |
			| IB CUSTOMER     | new record with All fields             |
			| IB CUSTOMER     | new recored with only mandatory fields |
			| IB CUSTOMER     | new recored without first_name         |
			| IB CUSTOMER     | new record without channel_identifier  |

	@in-valid-scenarios
	Scenario Outline: A new Prospect is not created in DB due to any in-valid condition
		Given Test data for "create prospect" is created as "<TEST_DATA>"
		When A "post" request to "create prospect" is executed for "<TEST_DATA>"
		Then Validate the response of "create prospect" for "<TEST_DATA>" and "<USER_TYPE>"

		Examples:
			| USER_TYPE       | TEST_DATA                                            |
			| UNAUTH Customer | new recored without created_on                       |
			| UNAUTH Customer | new recored with created_on as blank                 |
			| UNAUTH Customer | new recored without brand_identifier                 |
			| UNAUTH Customer | new recored with brand_identifier as blank           |
			| UNAUTH Customer | new record with only optional fields                 |
			| UNAUTH Customer | new record with mandatory fields as blank            |
			| UNAUTH Customer | new record with first_name as blank                  |
			| UNAUTH Customer | new record with channel_identifier as blank          |
			| UNAUTH Customer | new record with optional fields as blank             |
			| UNAUTH Customer | new record with created_on as Number                 |
			| UNAUTH Customer | new record with created_on as an invalid Date String |
			| UNAUTH Customer | new record with brand_identifier as Number           |
			| UNAUTH Customer | new record with channel_identifier as Number         |
			| UNAUTH Customer | new record with first_name as Number                 |
			| UNAUTH Customer | invalid value of x-authorization-id                  |
			| IB CUSTOMER     | new recored without created_on                       |
			| IB CUSTOMER     | new recored with created_on as blank                 |
			| IB CUSTOMER     | new recored without brand_identifier                 |
			| IB CUSTOMER     | new recored with brand_identifier as blank           |
			| IB CUSTOMER     | new record with only optional fields                 |
			| IB CUSTOMER     | new record with mandatory fields as blank            |
			| IB CUSTOMER     | new record with first_name as blank                  |
			| IB CUSTOMER     | new record with channel_identifier as blank          |
			| IB CUSTOMER     | new record with optional fields as blank             |
			| IB CUSTOMER     | new record with created_on as Number                 |
			| IB CUSTOMER     | new record with created_on as an invalid Date String |
			| IB CUSTOMER     | new record with brand_identifier as Number           |
			| IB CUSTOMER     | new record with channel_identifier as Number         |
			| IB CUSTOMER     | new record with first_name as Number                 |
			| IB CUSTOMER     | invalid value of x-authorization-id                  |

	@in-valid-scenarios
	Scenario Outline: A new Prospect is not created in DB due to existing value of x-authorization-id
		Given Test data for "create prospect" is created as "<TEST_DATA>"
		And The header values are set with user as "<USER_TYPE>"
		When A "post" request to "create prospect" is executed for "<TEST_DATA>"
		Then Validate the response of "create prospect" for "<TEST_DATA>" and "<USER_TYPE>"
		And A "post" request to "create prospect" is executed for "<TEST_DATA>"
		Then Validate the response of "create prospect" for "existing value of x-authorization-id" and "<USER_TYPE>"

		Examples:
			| USER_TYPE       | TEST_DATA                  |
			| UNAUTH Customer | new record with All fields |
			| IB CUSTOMER     | new record with All fields |


