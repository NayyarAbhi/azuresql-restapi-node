const express = require("express");
const controller = require("../controller/intentController.js");
const prospectIntentRoutes = express.Router();

prospectIntentRoutes.route('/:ProspectId/intent')
    .post(controller.addIntent)
    .get(controller.findIntentByProspectId)

prospectIntentRoutes.route('/:ProspectId/intent/:IntentId')
    .get(controller.findIntentByIntentId)

// exporting modules, to be used in the other .js files
module.exports = { prospectIntentRoutes }