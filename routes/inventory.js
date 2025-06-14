const express = require('express');
const router = express.Router();
const invCtrl = require('../controllers/inventoryController');

// Matches GET /inventory/detail/:inv_id
router.get('/detail/:inv_id', invCtrl.getVehicleDetail);
router.get('/add-classification', invCtrl.addClassificationView);
router.post('/add-classification', invCtrl.addClassification);
router.get('/', invCtrl.managementView);
router.get('/add-inventory', invCtrl.addInventoryView);
router.post('/add-inventory', invCtrl.addInventory);

module.exports = router;