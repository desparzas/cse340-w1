const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const { generateToken } = require("../utilities/jwtUtils");

// Route to deliver the login view
router.get("/login", accountController.buildLogin);
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.get("/", utilities.handleErrors(accountController.buildAccountManagement));

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.accountLogin)
);

router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
});

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