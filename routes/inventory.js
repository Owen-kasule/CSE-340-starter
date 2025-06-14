const express = require('express');
const router  = express.Router();
const invCtrl = require('../controllers/inventory-controller');

// Matches GET /inventory/detail/:inv_id
router.get('/detail/:inv_id', invCtrl.getVehicleDetail);
router.get('/add-classification', invCtrl.addClassificationView);
router.post('/add-classification', invCtrl.addClassification);

module.exports = router;