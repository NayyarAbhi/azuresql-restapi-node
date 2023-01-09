IF (SCHEMA_ID('prospect') IS NULL)
BEGIN EXEC ('CREATE SCHEMA [prospect] AUTHORIZATION [dbo]')
END


IF OBJECT_ID(N'prospect.tbl_prospect', N'U') IS NULL
CREATE TABLE prospect.tbl_prospect (
    prospect_id integer NOT NULL PRIMARY KEY,
    created_on datetime,
    brand_identifier varchar(50),
    channel_identifier varchar(50),
    first_name varchar(50)
);
GO


IF OBJECT_ID(N'prospect.tbl_prospect_identifiers', N'U') IS NULL
CREATE TABLE prospect.tbl_prospect_identifiers (
    prospect_identifier_id varchar(50) NOT NULL PRIMARY KEY,
    prospect_id integer ,
    identifier varchar(50),
    identifier_type varchar(50),
    active_from datetime,
    active_to datetime,
    FOREIGN KEY (prospect_id) references prospect.tbl_prospect(prospect_id)
 );
GO

IF OBJECT_ID(N'prospect.tbl_intent', N'U') IS NULL
CREATE TABLE prospect.tbl_intent (
    intent_id varchar(50) NOT NULL PRIMARY KEY,
    prospect_id integer,
    intent_questionaire_payload varchar(500),
    active_from datetime,
    active_to datetime,
    FOREIGN KEY (prospect_id) references prospect.tbl_prospect(prospect_id)
 );
GO
