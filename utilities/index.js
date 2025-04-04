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
module.exports = Util;
