// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/classification-validation");
const regValidate2 = require("../utilities/inventory-validation");
const authenticateJWT = require("../middlewares/authenticateJWT");


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get('/detail/:id', utilities.handleErrors(invController.getVehicleDetail));

router.get('/', utilities.handleErrors(invController.renderManagementView));

router.get('/add-classification', utilities.handleErrors(invController.renderAddClassificationView));

router.post('/add-classification', 
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

router.get('/add-inv', utilities.handleErrors(invController.renderAddInventoryView));
router.post('/add-inv',
    authenticateJWT,
    regValidate2.inventoryRules(),
    regValidate2.checkInventoryData,
    utilities.handleErrors(invController.addInventory));

module.exports = router;