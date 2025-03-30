const utilities = require(".");
const classificationModel = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");

const validate = {};

validate.classificationRules = () => {
  console.log("validationRules called");
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a classification name.")
      .custom(async (classification_name) => {
        const classificationExists =
          await classificationModel.getClassificationsByName(
            classification_name
          );

        console.log(
          "classificationExists.length: " + classificationExists.length
        );
        if (classificationExists.length > 0) {
          throw new Error("Classification already exists.");
        }
      }),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors: ", errors.array());
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      classification_name,
      nav,
      errors,
    });

    return;
  } else {
    next();
  }
};

module.exports = validate;
