const inventoryModel = require('../models/inventoryModel');
const utilities = require('../utilities');
const validator = require('validator');

// Management view
exports.managementView = (req, res) => {
  res.render('inventory/management', { 
    message: req.flash('message'),
    title: 'Inventory Management'
  });
};

// Add Classification view (GET)
exports.addClassificationView = (req, res) => {
  res.render('inventory/add-classification', { 
    message: req.flash('message'),
    classification_name: '',
    title: 'Add Classification'
  });
};

// Add Classification (POST)
exports.addClassification = async (req, res) => {
  let { classification_name } = req.body;
  if (!classification_name || !validator.isAlphanumeric(classification_name)) {
    req.flash('message', 'Invalid classification name. Only letters and numbers allowed.');
    return res.render('inventory/add-classification', { 
      message: req.flash('message'),
      classification_name,
      title: 'Add Classification'
    });
  }
  try {
    const result = await inventoryModel.insertClassification(classification_name);
    if (result.rowCount === 1) {
      req.flash('message', 'Classification added successfully!');
      res.redirect('/inv');
    } else {
      req.flash('message', 'Failed to add classification.');
      res.render('inventory/add-classification', { 
        message: req.flash('message'), 
        classification_name,
        title: 'Add Classification'
      });
    }
  } catch (err) {
    req.flash('message', 'Server error.');
    res.render('inventory/add-classification', { 
      message: req.flash('message'), 
      classification_name,
      title: 'Add Classification'
    });
  }
};

// Add Inventory view (GET)
exports.addInventoryView = async (req, res) => {
  const classificationList = await utilities.buildClassificationList();
  res.render('inventory/add-inventory', { 
    message: req.flash('message'), 
    classificationList,
    title: 'Add Vehicle',
    // Sticky fields
    classification_id: '', inv_make: '', inv_model: '', inv_year: '', inv_description: '',
    inv_image: '', inv_thumbnail: '', inv_price: '', inv_miles: '', inv_color: ''
  });
};

// Add Inventory (POST)
exports.addInventory = async (req, res) => {
  let {
    classification_id, inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
  } = req.body;

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
      title: 'Add Vehicle',
      classification_id, inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    });
  }

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
        title: 'Add Vehicle',
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
      title: 'Add Vehicle',
      classification_id, inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    });
  }
};

// Vehicle detail view (example)
exports.getVehicleDetail = async (req, res) => {
  try {
    const vehicle = await inventoryModel.getVehicleById(req.params.id);
    if (!vehicle) {
      return res.status(404).render('error', { message: 'Vehicle not found', title: 'Error' });
    }
    const vehicleDetailHTML = utilities.renderVehicleDetailHTML(vehicle);
    res.render('inventory/detail', {
      title: `${vehicle.inv_make} ${vehicle.inv_model} Details`,
      vehicleDetailHTML
    });
  } catch (err) {
    res.status(500).render('error', { message: 'Server error', title: 'Error' });
  }
};