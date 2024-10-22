const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);

        const { firmName, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : undefined;

        
        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            console.error("Vendor not found:", req.vendorId);
            return res.status(404).json({ message: "Vendor not found" });
        }

        const firm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id
        });

        const savedFirm = await firm.save();
        console.log('Firm saved:', savedFirm);
        vendor.firm.push(savedFirm._id);
        await vendor.save();

        return res.status(200).json({ message: 'Firm added successfully', firm: savedFirm });
    } catch (error) {
        console.error('Error saving firm:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};



const deleteFirmById = async(req, res)=>{
    try {
         const firmId = req.params.firmId;

        const deletedFirm = await Firm.findByIdAndDelete(firmId);

        if(!deletedFirm){
          return res.status(404).json({error: "No firm found"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "internal server error"})
    }
}


module.exports = { addFirm: [upload.single('image'), addFirm], deleteFirmById };