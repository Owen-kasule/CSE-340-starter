/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const static = require("./routes/static");
const inventoryRoutes = require('./routes/inventory');
const miscRouter = require('./routes/misc');
const accountRoutes = require('./routes/account');
require('./database/pool');
const classificationModel = require('./models/classification-model');
const classificationRouter = require('./routes/classification');
const session = require('express-session');
const flash = require('connect-flash');
const utilities = require('./utilities/');

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Middleware
 *************************/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  name: 'sessionId',
}));
app.use(flash());

// Add JWT token check to all routes
app.use(utilities.checkJWTToken);

app.use(async (req, res, next) => {
  try {
    const classifications = await classificationModel.getClassifications();
    res.locals.classifications = classifications;
    res.locals.active = '';
    // Make flash messages available to all views
    res.locals.flash = req.flash();
    next();
  } catch (err) {
    next(err);
  }
});

/* ***********************
 * Static Files
 *************************/
app.use(express.static('public'));

/* ***********************
 * Routes
 *************************/
app.use(static);

// Account routes
app.use('/account', accountRoutes);

// Inventory routes - add middleware to check for Employee/Admin access to management routes
app.use('/inv', inventoryRoutes);
app.use('/inventory', inventoryRoutes); // for detail pages (public access)

// Misc routes
app.use(miscRouter);

// Classification routes
app.use('/classification', classificationRouter);

// Root route to render index.ejs with a title
app.get('/', (req, res) => {
  res.locals.active = 'home';
  res.render('index', { title: 'Home' });
});

// 404 handler
app.use((req, res, next) => {
  const err = new Error(`Not Found: ${req.originalUrl}`);
  err.status = 404;
  next(err);
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render('error', {
    title: `${err.status || 500} – Error`,
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500;
const host = process.env.HOST || 'localhost';

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
