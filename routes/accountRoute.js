const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const { generateToken } = require("../utilities/jwtUtils");

// Route to deliver the login view
router.get("/login", accountController.buildLogin);
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

router.get("/update/:id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateView));
router.post("/update", regValidate.updateRules(), regValidate.checkRegDataUpdate, utilities.handleErrors(accountController.updateAccount));
router.post("/update-password", regValidate.updatePasswordRules(), regValidate.checkRegDataUpdatePassword, utilities.handleErrors(accountController.updatePassword));

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.accountLogin)
);

// Add this route with your other routes
router.get("/logout", accountController.logoutUser);

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