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

router.post(
    "/update",
    regValidate2.inventoryRules(),
    regValidate2.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

router.get('/add-inv', utilities.handleErrors(invController.renderAddInventoryView));
router.post('/add-inv',
    authenticateJWT,
    regValidate2.inventoryRules(),
    regValidate2.checkInventoryData,
    utilities.handleErrors(invController.addInventory));

router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
);

router.get('/edit/:inv_id', utilities.handleErrors(invController.editInventoryView));

module.exports = router;