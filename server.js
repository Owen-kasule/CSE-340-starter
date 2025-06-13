/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const app = express();
const static = require("./routes/static");
const inventoryRouter = require('./routes/inventory');
const miscRouter = require('./routes/misc');
require('./database/pool');
const classificationModel = require('./models/classification-model');

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Middleware
 *************************/
app.use(async (req, res, next) => {
  try {
    // Fetch all classification records once per request
    const classifications = await classificationModel.getClassifications();
    // Make available to every EJS view as `classifications`
    res.locals.classifications = classifications;
    next();
  } catch (err) {
    next(err);
  }
});

/* ***********************
 * Routes
 *************************/
app.use(static);

// Inventory routes
app.use('/inventory', inventoryRouter);

// Misc routes
app.use(miscRouter);

// Root route to render index.ejs with a title
app.get('/', (req, res) => {
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

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
