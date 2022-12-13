const express = require("express");
const controller = require("../controller/prospectController.js");
const prospectRoutes = express.Router();

prospectRoutes.route('/')
    .post(controller.createProspect);

prospectRoutes.route('/:ProspectId')
    .put(controller.addProspect);


// exporting modules, to be used in the other .js files
module.exports = { prospectRoutes }
