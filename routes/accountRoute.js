const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

// Route to deliver the login view
router.get("/login", accountController.buildLogin);

// Error handler middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

module.exports = router;