const express = require("express");
const controller = require('../controller/otpController.js');
const otpRoutes = express.Router();

otpRoutes.route('/')
    .post(controller.createOtprecord)
    .get(controller.getOtprecord)

// exporting modules, to be used in the other .js files
module.exports = { otpRoutes }