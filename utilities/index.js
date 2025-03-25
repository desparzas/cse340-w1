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

module.exports = Util;
