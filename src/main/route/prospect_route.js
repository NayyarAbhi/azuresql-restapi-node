const express = require("express");
const controller = require("../controller/prospectController.js");
const prospectRoutes = express.Router();

prospectRoutes.route('/')
    .get(controller.getProspect)
    .put(controller.updateProspect);


// exporting modules, to be used in the other .js files
module.exports = { prospectRoutes }