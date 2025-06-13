const inventoryModel = require('../models/inventory-model');

async function getByClassification(req, res, next) {
  try {
    const name = req.params.name.toLowerCase();
    const vehicles = await inventoryModel.getVehiclesByClassification(name);
    res.locals.active = name; // For navbar highlighting
    res.render('classification/list', {
      title: `${name} vehicles`,
      vehicles,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getByClassification,
};