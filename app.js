const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require('./utilities'); // Asegúrate de que este archivo exista y tenga el método getNav

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);

// Inventory Route
app.use("/inv", inventoryRoute);

// Error handling middleware
app.use(async (err, req, res, next) => {
    const nav = await utilities.getNav();
    console.error(`Error at: "${req.originalUrl}": ${err.message}`);
    let message = err.status == 404 ? err.message : "Oh no! There was a crash. Maybe try a different route?";
    res.render("errors/error", {
        title: err.status || "Server Error",
        message,
        nav,
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
