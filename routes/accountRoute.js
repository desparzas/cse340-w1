const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const { generateToken } = require("../utilities/jwtUtils");

// Route to deliver the login view
router.get("/login", accountController.buildLogin);
router.get("/register", utilities.handleErrors(accountController.buildRegister));


router.post("/login", async (req, res) => {
  console.log("Login attempt:", req.body);
  const { account_email, account_password } = req.body;
  console.log("Email:", account_email);
  console.log("Password:", account_password);

  // Replace this with your actual authentication logic
  const account = await accountController.validCredentials(account_email, account_password);

  if (account) {
    const token = generateToken({ account_id: account.account_id, account_type: account.account_type });
    res.cookie('jwt', token, { httpOnly: true, secure: true });
    return res.redirect('/');
  }

  req.flash("notice", "Invalid credentials");
  res.redirect("/account/login");
});

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