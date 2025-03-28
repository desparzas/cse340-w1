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
          return res.status(404).render('errors/404', { title: 'Vehicle Not Found' });
      }

      const vehicleHTML = utilities.buildVehicleHTML(vehicleData);
      res.render('inventory/detail', {
          title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
          vehicleHTML,
          nav
      });
  } catch (error) {
      next(error);
  }
};

module.exports = invCont;
