const express = require("express");
const controller = require("../controller/intentController.js");
const intentRoutes = express.Router();

intentRoutes.route('/:ProspectId/intent')
    .post(controller.addIntent)
    .get(controller.findByProspectId)

intentRoutes.route('/:ProspectId/intent/:IntentId')
    .get(controller.findByIntentIdProspectId)
    .put(controller.updateIntent)

// exporting modules, to be used in the other .js files
module.exports = { intentRoutes }