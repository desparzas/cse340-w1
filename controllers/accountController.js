const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
require("dotenv").config();

async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      loggedin: res.locals.loggedin || false,
      accountData: res.locals.accountData || null,
    });
  } catch (error) {
    console.error("Error delivering login view:", error.message);
    next(error);
  }
}

async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    res,
    loggedin: res.locals.loggedin || false,
    accountData: res.locals.accountData || null,
  });
}

async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      loggedin: res.locals.loggedin || false,
      accountData: res.locals.accountData || null,
    });
    return;
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      const cookieOptions = {
        httpOnly: true,
        maxAge: 3600 * 1000,
        ...(process.env.NODE_ENV !== "development" && { secure: true }),
      };
      res.cookie("jwt", accessToken, cookieOptions);
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        loggedin: res.locals.loggedin || false,
        accountData: res.locals.accountData || null,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult.rowCount) {
    // Create account data object for JWT
    const accountData = {
      account_firstname,
      account_lastname,
      account_email,
      account_type: "Client",
      account_id: regResult.rows[0].account_id
    };

    // Generate and set JWT token
    const accessToken = jwt.sign(
      accountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 }
    );

    // Set cookie with token
    const cookieOptions = {
      httpOnly: true,
      maxAge: 3600 * 1000,
      ...(process.env.NODE_ENV !== "development" && { secure: true }),
    };
    res.cookie("jwt", accessToken, cookieOptions);

    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. You are now logged in.`
    );
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

async function validCredentials(account_email, account_password) {
  const found = await accountModel.checkExistingEmail(account_email);
  if (found) {
    const account = await accountModel.getAccountByEmail(account_email);
    console.log("Account found:", account);
    const passwordMatch = await bcrypt.compare(
      account_password,
      account.account_password
    );
    if (passwordMatch) {
      return account;
    }
  }
  return null;
}

async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      account_firstname: "",
      account_lastname: "",
      account_email: "",
      account_password: "",
      loggedin: res.locals.loggedin || false,
      accountData: res.locals.accountData || null,
    });
  } catch (error) {
    console.error("Error delivering registration view:", error.message);
    next(error);
  }
}

async function buildUpdateView(req, res, next) {
  const account_id = req.params.id;
  const accountData = await accountModel.getAccountById(account_id);
  let nav = await utilities.getNav();
  res.render("account/update-account", {
    title: "Update Account",
    nav,
    locals: accountData,
    errors: null,
    loggedin: res.locals.loggedin || false,
    accountData: res.locals.accountData || null,
  });
}

async function updateAccount(req, res, next) {
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;
  console.log("Account ID:", account_id);
  console.log("Account First Name:", account_firstname);
  console.log("Account Last Name:", account_lastname);
  console.log("Account Email:", account_email);
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );
  if (updateResult.rowCount) {
    req.flash("notice", "Account updated successfully.");
    // Update the account data in the session

    let oldAccountData = res.locals.accountData;
    let newAccountData = {};

    newAccountData.account_id = account_id;
    newAccountData.account_firstname = account_firstname;
    newAccountData.account_lastname = account_lastname;
    newAccountData.account_email = account_email;
    newAccountData.account_type = oldAccountData.account_type;


    const updatedToken = jwt.sign(
      newAccountData,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Enviar el nuevo token al cliente
    res.cookie("jwt", updatedToken, {
      httpOnly: true,
      maxAge: 3600 * 1000,
      ...(process.env.NODE_ENV !== "development" && { secure: true }),
    });

    res.redirect("/account/");
  } else {
    req.flash("notice", "Account update failed.");
    res.redirect(`/account/update/${account_id}`);
  }
}

async function updatePassword(req, res, next) {
  const { account_id, account_password } = req.body;
  console.log("_".repeat(50));
  console.log("Updating", body);
  console.log("Account ID:", account_id);
  console.log("Account Password:", account_password);
  console.log("_".repeat(50));
  const hashedPassword = await bcrypt.hash(account_password, 10);
  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  );
  if (updateResult.rowCount) {
    req.flash("notice", "Password updated successfully.");
    res.redirect("/account/");
  } else {
    req.flash("notice", "Password update failed.");
    res.redirect(`/account/update/${account_id}`);
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  buildAccountManagement,
  registerAccount,
  validCredentials,
  accountLogin,
  buildUpdateView,
  updateAccount,
  updatePassword,
};
