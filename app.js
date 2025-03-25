const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const inventoryRoute = require("./routes/inventoryRoute");

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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});