const { getVehicleById } = require('../models/inventory-model');
const { renderVehicleDetailHTML } = require('../utilities');

async function getVehicleDetail(req, res, next) {
  try {
    const invId = parseInt(req.params.inv_id, 10);
    const vehicle = await getVehicleById(invId);
    if (!vehicle) {
      const err = new Error('Vehicle not found');
      err.status = 404;
      throw err;
    }
    const detailHTML = renderVehicleDetailHTML(vehicle);
    res.render('inventory/detail', {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      detailHTML, // ← this is critical!
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getVehicleDetail,
};