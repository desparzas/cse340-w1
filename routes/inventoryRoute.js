// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/classification-validation");
const regValidate2 = require("../utilities/inventory-validation");
const authenticateJWT = require("../middlewares/authenticateJWT");


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.authorizeRole, utilities.handleErrors(invController.buildByClassificationId));

router.get('/detail/:id', utilities.authorizeRole, utilities.handleErrors(invController.getVehicleDetail));

router.get('/', utilities.authorizeRole, utilities.handleErrors(invController.renderManagementView));

router.get('/add-classification', utilities.authorizeRole, utilities.handleErrors(invController.renderAddClassificationView));

router.post('/add-classification', 
    utilities.authorizeRole,
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

router.post(
    "/update",
    utilities.authorizeRole,
    regValidate2.inventoryRules(),
    regValidate2.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

router.get('/add-inv', utilities.authorizeRole, utilities.handleErrors(invController.renderAddInventoryView));
router.post('/add-inv',
    authenticateJWT,
    utilities.authorizeRole,
    regValidate2.inventoryRules(),
    regValidate2.checkInventoryData,
    utilities.handleErrors(invController.addInventory));

router.get(
    "/getInventory/:classification_id",
    utilities.authorizeRole,
    utilities.handleErrors(invController.getInventoryJSON)
);

router.get('/edit/:inv_id', utilities.authorizeRole, utilities.handleErrors(invController.editInventoryView));

router.get('/delete/:inv_id', utilities.authorizeRole, utilities.handleErrors(invController.renderDeleteConfirmationView));

router.post('/delete', utilities.authorizeRole, utilities.handleErrors(invController.deleteInventoryItem));


module.exports = router;