const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0]?.classification_name || "Unknown";
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    console.error(`Error at: "${req.originalUrl}": ${error.message}`);
    next(error);
  }
};

invCont.getVehicleDetail = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    let nav = await utilities.getNav();
    const vehicleData = await invModel.getVehicleById(vehicleId);

    if (!vehicleData) {
      return res
        .status(404)
        .render("errors/404", { title: "Vehicle Not Found" });
    }

    const vehicleHTML = utilities.buildVehicleHTML(vehicleData);
    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      vehicleHTML,
      nav,
    });
  } catch (error) {
    next(error);
  }
};

invCont.renderManagementView = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
    });
  } catch (error) {
    next(error);
  }
};

invCont.renderAddClassificationView = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

invCont.addClassification = async (req, res, next) => {
  try {
    console.log(req.body);
    const { classification_name } = req.body;
    console.log(classification_name);
    await invModel.insertClassification(classification_name);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};



invCont.renderAddInventoryView = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();

    const classification_id = req.params.classificationId || null;

    // Armar el HTML del select con las opciones
    let classificationList = await utilities.renderSelectClassificationView(
      classification_id
    );

    res.render("inventory/add-inv", {
      title: "Add Inventory",
      nav,
      classificationList: classificationList,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

invCont.addInventory = async (req, res, next) => {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_color,
      inv_miles,
    } = req.body;

    const inv_image = "/images/vehicles/no-image.png";
    const inv_thumbnail = "/images/vehicles/no-image-tn.png";

    console.log("body", req.body);
    await invModel.insertInventory({
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_color,
      inv_miles,
      inv_image,
      inv_thumbnail,
    });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

invCont.renderManagementView = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.renderSelectClassificationView(); // Add this line
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect, // Pass the select list to the view
    });
  } catch (error) {
    next(error);
  }
};

invCont.getInventoryJSON = async (req, res, next) => {
  console.log("getInventoryJSON called");
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0]?.inv_id) {
    console.log("Data found:", invData);
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

module.exports = invCont;
