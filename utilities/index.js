const jwt = require("jsonwebtoken");
require("dotenv").config();
const invModel = require("../models/inventory-model");
const Util = {};

Util.getNav = async function () {
  let data = await invModel.getClassifications();
  let list = "<ul class = 'navbar'>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildVehicleHTML = (vehicle) => {
  console.log(vehicle);
  return `
      <div class="vehicle-detail">
          <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}" class="vehicle-image">
          <div class="vehicle-info">
              <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
              <p><strong>Price:</strong> $${vehicle.inv_price.toLocaleString()}</p>
              <p><strong>Mileage:</strong> ${vehicle.inv_miles.toLocaleString()} miles</p>
              <p><strong>Description:</strong> ${vehicle.inv_description}</p>
          </div>
      </div>
  `;
};

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

Util.renderSelectClassificationView = async (classification_id) => {
  try {
    const classifications = await invModel.getClassifications();

    console.log(classifications);

    // Armar el HTML del select con las opciones
    let classificationList =
      '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";
    classifications.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"';
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected ";
      }
      classificationList += ">" + row.classification_name + "</option>";
    });
    classificationList += "</select>";

    return classificationList;
  } catch (error) {
    console.error("Error fetching classifications:", error);
    throw error; // Re-throw the error for further handling
  }
};

Util.checkJWTToken = (req, res, next) => {
  console.log("Checking JWT token...");
  if (req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
      if (err) {
        req.flash("notice", "Please log in.");
        res.clearCookie("jwt");
        return res.redirect("/account/login");
      }
      res.locals.accountData = accountData;
      res.locals.loggedin = 1;
      console.log("Logged in as: ", accountData);
      console.log("Account data: ", res.locals.accountData);

      next();
    });
  } else {
    next();
  }
};

Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

Util.authorizeRole = (req, res, next) => {
  const accountType = res.locals.accountData?.account_type;
  if (accountType === "Employee" || accountType === "Admin") {
    return next();
  }
  req.flash("notice", "You do not have permission to access this area.");
  res.redirect("/account/login");
}

module.exports = Util;
