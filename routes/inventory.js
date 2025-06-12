const express = require('express');
const router  = express.Router();
const invCtrl = require('../controllers/inventory-controller');

// 1️⃣ DETAIL ROUTE
router.get('/detail/:inv_id', invCtrl.getVehicleDetail);

module.exports = router;