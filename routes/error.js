// filepath: routes/error.js
const express = require('express');
const router = express.Router();
const invController = require("../controllers/errorController");
const errorController = require('../controllers/errorController');

router.get('/trigger-error', errorController.get500);

module.exports = router;