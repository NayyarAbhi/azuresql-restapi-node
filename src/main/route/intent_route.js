const express = require("express");
const controller = require("../controller/intentController.js");
const prospectIntentRoutes = express.Router();

prospectIntentRoutes.route('/:ProspectId/intent')
    .post(controller.addIntent)
    .get(controller.findByProspectId)

prospectIntentRoutes.route('/:ProspectId/intent/:IntentId')
    .get(controller.findByIntentIdProspectId)

// exporting modules, to be used in the other .js files
module.exports = { prospectIntentRoutes }