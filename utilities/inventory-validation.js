const utilities = require(".");
const { body, validationResult } = require("express-validator");

const validate = {};

validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a make."),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a model."),
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Please provide a valid year."),
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Please provide a description."),
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isFloat({ gt: 0 })
      .withMessage("Please provide a valid price."),
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ gt: 0 })
      .withMessage("Please provide valid mileage."),
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a color."),
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Please select a classification."),
  ];
};

validate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors: ", errors.array());
    let nav = await utilities.getNav();
    let classificationList = await utilities.renderSelectClassificationView(
      classification_id
    );

    res.render("inventory/add-inv", {
      title: "Add Inventory",
      nav,
      classificationList: classificationList,
      errors,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      classification_id: req.body.classification_id,
    });

    return;
  } else {
    next();
  }
};

validate.checkUpdateData = async (req, res, next) => {
  console.log("Validation checkUpdateData");
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors: ", errors.array());
    let nav = await utilities.getNav();
    let classificationList = await utilities.renderSelectClassificationView(classification_id);

    res.render("inventory/edit-inventory", {
      title: "Edit Inventory",
      nav,
      classificationList,
      errors,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });

    return;
  } else {
    console.log("Validation passed, proceeding to next middleware.");
    next();
  }
};

module.exports = validate;
