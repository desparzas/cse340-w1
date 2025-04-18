const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const reviewModel = require("../models/review-model");

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
      loggedin: res.locals.loggedin || false,
      accountData: res.locals.accountData || null,
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

    const reviews = await reviewModel.getReviewsByVehicle(vehicleId);

    const vehicleHTML = utilities.buildVehicleHTML(vehicleData);
    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      vehicleHTML,
      vehicle: vehicleData,
      reviews,
      nav,
      loggedin: res.locals.loggedin || false,
      accountData: res.locals.accountData || null,
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
      loggedin: res.locals.loggedin || false,
      accountData: res.locals.accountData || null,
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
      loggedin: res.locals.loggedin || false,
      accountData: res.locals.accountData || null,
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
      loggedin: res.locals.loggedin || false,
      accountData: res.locals.accountData || null,
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
      classificationSelect,
      loggedin: res.locals.loggedin || false,
      accountData: res.locals.accountData || null,
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

invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getVehicleById(inv_id);
  const classificationList = await utilities.renderSelectClassificationView(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    loggedin: res.locals.loggedin || false,
    accountData: res.locals.accountData || null,
  });
};

invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationList = await utilities.renderSelectClassificationView(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

invCont.renderDeleteConfirmationView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getVehicleById(inv_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
      loggedin: res.locals.loggedin || false,
      accountData: res.locals.accountData || null,
    });
  } catch (error) {
    next(error);
  }
};

invCont.deleteInventoryItem = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id);
    const deleteResult = await invModel.deleteInventoryItem(inv_id);

    if (deleteResult.rowCount) {
      req.flash("notice", "The item was successfully deleted.");
      res.redirect("/inv/");
    } else {
      req.flash("notice", "Sorry, the delete failed.");
      res.redirect(`/inv/delete/${inv_id}`);
    }
  } catch (error) {
    next(error);
  }
};


module.exports = invCont;
