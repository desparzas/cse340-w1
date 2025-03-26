const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Route to deliver the login view
router.get("/login", accountController.buildLogin);
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post("/register", utilities.handleErrors(accountController.registerAccount));



// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Error handler middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

module.exports = router;