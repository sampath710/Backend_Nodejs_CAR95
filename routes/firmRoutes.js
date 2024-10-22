
const express = require('express');
const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');
const path = require('path');


const router = express.Router()

router.get('/add-firm', verifyToken, firmController.addFirm);

router.post('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.setHeader('Content-Type', 'image/jpeg'); // Set the correct header
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName), (err) => {
        if (err) {
            res.status(err.status).end();
        }
    });
});


router.delete('/:firmId', firmController.deleteFirmById);

module.exports = router;