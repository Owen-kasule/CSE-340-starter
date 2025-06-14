const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Matches GET /inventory/detail/:inv_id
router.get('/detail/:inv_id', inventoryController.getVehicleDetail);
router.get('/add-classification', inventoryController.addClassificationView);
router.post('/add-classification', inventoryController.addClassification);
router.get('/', inventoryController.managementView);

module.exports = router;