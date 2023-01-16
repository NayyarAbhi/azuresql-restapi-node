const express = require("express");
const controller = require("../controller/prospectInformationController.js");
const prospectInformationRoutes = express.Router();

// prospectInformationRoutes.route('/:ProspectId/save')
//     .post(controller.createProspectInformation)

prospectInformationRoutes.route('/:ProspectId/fetch')
    .get(controller.findProspectInfoByProspectId);

prospectInformationRoutes.route('/:ProspectId/fetch/:PayloadIdentifier')
    .get(controller.findProspectInfoByPayloadIdentifier);

prospectInformationRoutes.route('/:ProspectId/fetch/:PayloadIdentifier/:PayloadId')
     .get(controller.findProspectInfoByPayloadIdentifierAndPayloadId);

// exporting modules, to be used in the other .js files
module.exports = { prospectInformationRoutes }