
const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage });

const addFirm = async(req, res)=>{
   try{
    const {firmName, area, category, offer} = req.body;

    const image = req.file? req.file.filename: undefined;

    const vendor = await Vendor.findById(req.vendorId);
    if(!vendor){
        res.status(404).json({message: "vendor not found"})
    }

    const firm = new Firm({
        firmName, area, category, offer, image, vendor: vendor._id
    })

    const savedFirm =  await firm.save();

    vendor.firm.push(savedFirm)

    await vendor.save()


    return res.status(200).json({message:'Firm Added successfully'})

   }catch(error){
        console.error(error)
        res.status(500).json("internal server error")
   }
    

}

const deleteFirmById = async(req, res)=>{
    try{
            const productId = req.params.productId;

            const deletedProduct = await Firm.findByIdAndDelete(firmId)

            if(!deleteProduct){
                return res.status(404).json({error: "No product found"})
            }
    }catch(error){
        console.error(error);
    res.status(500).json({ error: "Internal server error" });     
    }
}

module.exports = { addFirm: [upload.single('image'), addFirm], deleteFirmById }
