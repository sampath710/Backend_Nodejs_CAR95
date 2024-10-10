const Product = require("../models/Product");
const Firm = require("../models/Firm"); // Ensure you import the Firm model
const multer = require("multer");
const path = require("path"); // Import path module to use path.extname

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure 'uploads/' directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use path to get the file extension
    },
});

const upload = multer({ storage });

const addProduct = async (req, res) => {
    try {
        const { productName, price, category, bestseller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(400).json({ error: "No firm found" });
        }

        const product = new Product({
            productName,
            price,
            category,
            bestseller,
            description,
            image,
            firm: firm._id
        });

        const savedProduct = await product.save();

        firm.products.push(savedProduct); // Ensure to push into the correct array name

        await firm.save();

        res.status(200).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getProductByFirm = async(req, res)=>{
  try {
          const firmId = req.params.firmId;
          console.log("Firm ID:", firmId);
          const firm = await Firm.findById(firmId);

          if(!firm){
            return res.status(404).json({ error: `No firm found with ID: ${firmId}` });
          }

          const garageName = firm.firmName;
          const products = await Product.find({firm: firmId});

          res.status(200).json({garageName, products });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const deleteProductById = async(req, res)=>{
    try{
            const productId = req.params.productId;

            const deletedProduct = await Product.findByIdAndDelete(productId)

            if(!deleteProduct){
                return res.status(404).json({error: "No product found"})
            }
    }catch(error){
        console.error(error);
    res.status(500).json({ error: "Internal server error" });     
    }
}

module.exports = { addProduct: [upload.single('image'), addProduct], getProductByFirm, deleteProductById };
