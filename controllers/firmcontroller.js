const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path'); // Import path module

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

const addFirm = async (req, res) => {
    try {
        const { firmName, area, category, offer } = req.body;

        const image = req.file ? req.file.filename : undefined;

        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        const firm = new Firm({
            firmName,
            area,
            category,
            offer,
            image,
            vendor: vendor._id
        });

        const savedFirm = await firm.save();
        vendor.firm.push(savedFirm);
        await vendor.save();

        return res.status(200).json({ message: 'Firm added successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const deleteFirmById = async (req, res) => {
    try {
        const firmId = req.params.firmId; // Use firmId instead of productId

        const deletedFirm = await Firm.findByIdAndDelete(firmId); // Correct variable

        if (!deletedFirm) {
            return res.status(404).json({ error: "No firm found" });
        }

        return res.status(200).json({ message: "Firm deleted successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { addFirm: [upload.single('image'), addFirm], deleteFirmById };
