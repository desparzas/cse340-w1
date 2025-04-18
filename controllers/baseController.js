const utilities = require("../utilities");
const baseController = {};

baseController.buildHome = async function (req, res, next) {
  try{
    req.flash("notice", "This is a flash message.");
    const nav = await utilities.getNav();
    res.render("index", {
      title: "Home",
      nav,
      loggedin: res.locals.loggedin || false,
      accountData: res.locals.accountData || null,
    });
  } catch (error) {
    console.error(`Error at: "${req.originalUrl}": ${error.message}`);
    next(error);
  }
};

module.exports = baseController;