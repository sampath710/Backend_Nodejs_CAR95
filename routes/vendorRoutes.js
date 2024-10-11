const express = require('express');
const cors = require('cors');
const vendorController = require('../controllers/vendorController');

const router = express.Router();

router.use(cors());

const { getAllVendors } = vendorController;

router.post('/register', vendorController.vendorRegister);
router.post('/login', vendorController.vendorLogin);
router.get('/all-vendors', getAllVendors);
router.get('/single-vendor/:id', vendorController.getVendorById);

module.exports = router;
