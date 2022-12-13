const express = require("express");
const controller = require("../controller/prospectController.js");
const prospectRoutes = express.Router();

prospectRoutes.route('/')
    .post(controller.createProspect);

prospectRoutes.route('/:ProspectId')
    .put(controller.addProspect);

prospectRoutes.route('/find')
    .post(controller.findProspect);

prospectRoutes.route('/:ProspectId')
    .get(controller.findProspectById);



// exporting modules, to be used in the other .js files
module.exports = { prospectRoutes }
