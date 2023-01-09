const express = require("express");
const controller = require("../controller/intentController.js");
const prospectIntentRoutes = express.Router();

prospectIntentRoutes.route('/:ProspectId/intent')
    .post(controller.addIntent)


// exporting modules, to be used in the other .js files
module.exports = { prospectIntentRoutes }