const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const pool = require('./database'); // Database connection
const indexRouter = require('./routes/index');
const inventoryRoute = require("./routes/inventoryRoute");
const errorRouter = require('./routes/error');
const utilities = require('./utilities');
const accountRoute = require("./routes/accountRoute");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

// Flash Messages Middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(utilities.checkJWTToken); 

// Routes
app.use('/', indexRouter);

// Inventory Route
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute); // Add this line

app.use('/', errorRouter);

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