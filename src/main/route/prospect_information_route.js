const express = require("express");
const controller = require("../controller/prospectInformationController.js");
const prospectInformationRoutes = express.Router();

prospectInformationRoutes.route('/:ProspectId/save')
    .post(controller.createProspectInformation)

// exporting modules, to be used in the other .js files
module.exports = { prospectInformationRoutes }