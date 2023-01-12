const express = require("express");
const controller = require("../controller/prospectInformationController.js");
const prospectInformationRoute = express.Router();

prospectInformationRoute.route('/:ProspectId/fetch')
    .get(controller.findProspectInfoByProspectId);

prospectInformationRoute.route('/:ProspectId/fetch/:PayloadIdentifier')
    .get(controller.findProspectInfoByPayloadIdentifier);

    prospectInformationRoute.route('/:ProspectId/fetch/:PayloadIdentifier/:PayloadId')
     .get(controller.findProspectInfoByPayloadIdentifierAndPayloadId);

// exporting modules, to be used in the other .js files
module.exports = { prospectInformationRoute }