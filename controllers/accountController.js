const utilities = require("../utilities");

async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
    });
  } catch (error) {
    console.error("Error delivering login view:", error.message);
    next(error);
  }
}

async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  } catch (error) {
    console.error("Error delivering registration view:", error.message);
    next(error);
  }
}

module.exports = { buildLogin, buildRegister };
