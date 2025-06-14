const { getVehicleById } = require('../models/inventory-model');
const { renderVehicleDetailHTML } = require('../utilities');
const validator = require('validator');
const inventoryModel = require('../models/inventoryModel');
const utilities = require('../utilities');

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

exports.addInventoryView = async (req, res) => {
  const classificationList = await utilities.buildClassificationList();
  res.render('inventory/add-inventory', { message: req.flash('message'), classificationList });
};

exports.addInventory = async (req, res) => {
  let {
    classification_id, inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
  } = req.body;

  // Server-side validation
  let errors = [];
  if (!classification_id) errors.push('Classification is required.');
  if (!inv_make) errors.push('Make is required.');
  if (!inv_model) errors.push('Model is required.');
  if (!inv_year || !validator.isInt(inv_year, { min: 1900, max: 2099 })) errors.push('Year must be 4 digits.');
  if (!inv_description) errors.push('Description is required.');
  if (!inv_image) errors.push('Image path is required.');
  if (!inv_thumbnail) errors.push('Thumbnail path is required.');
  if (!inv_price || !validator.isFloat(inv_price)) errors.push('Price must be a number.');
  if (!inv_miles || !validator.isInt(inv_miles)) errors.push('Miles must be a number.');
  if (!inv_color) errors.push('Color is required.');

  if (errors.length > 0) {
    const classificationList = await utilities.buildClassificationList(classification_id);
    req.flash('message', errors.join(' '));
    return res.render('inventory/add-inventory', {
      message: req.flash('message'),
      classificationList,
      classification_id, inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    });
  }

  // Insert into DB
  try {
    const result = await inventoryModel.insertInventory({
      classification_id, inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    });
    if (result.rowCount === 1) {
      req.flash('message', 'Vehicle added successfully!');
      res.redirect('/inv');
    } else {
      const classificationList = await utilities.buildClassificationList(classification_id);
      req.flash('message', 'Failed to add vehicle.');
      res.render('inventory/add-inventory', {
        message: req.flash('message'),
        classificationList,
        classification_id, inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
      });
    }
  } catch (err) {
    const classificationList = await utilities.buildClassificationList(classification_id);
    req.flash('message', 'Server error.');
    res.render('inventory/add-inventory', {
      message: req.flash('message'),
      classificationList,
      classification_id, inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    });
  }
};

module.exports = {
  getVehicleDetail,
};