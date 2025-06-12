const miscRouter = require('./routes/misc');
app.use(miscRouter);

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