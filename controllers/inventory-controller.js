const { getVehicleById } = require('../models/inventory-model');
const { renderVehicleDetailHTML } = require('../utilities');
const validator = require('validator');
const inventoryModel = require('../models/inventoryModel');

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

exports.addClassificationView = (req, res) => {
  const message = req.flash('message');
  res.render('inventory/add-classification', { message });
};

exports.addClassification = async (req, res) => {
  let { classification_name } = req.body;
  // Server-side validation
  if (
    !classification_name ||
    !validator.isAlphanumeric(classification_name)
  ) {
    req.flash('message', 'Invalid classification name. Only letters and numbers allowed.');
    return res.render('inventory/add-classification', { 
      message: req.flash('message'),
      classification_name
    });
  }
  // Insert into DB
  try {
    const result = await inventoryModel.insertClassification(classification_name);
    if (result.rowCount === 1) {
      req.flash('message', 'Classification added successfully!');
      res.redirect('/inv');
    } else {
      req.flash('message', 'Failed to add classification.');
      res.render('inventory/add-classification', { message: req.flash('message'), classification_name });
    }
  } catch (err) {
    req.flash('message', 'Server error.');
    res.render('inventory/add-classification', { message: req.flash('message'), classification_name });
  }
};

exports.managementView = (req, res) => {
  const message = req.flash('message');
  res.render('inventory/management', { message });
};

module.exports = {
  getVehicleDetail,
};