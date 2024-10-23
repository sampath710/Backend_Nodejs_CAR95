const Product = require("../models/Product");
const multer = require("multer");
const Firm = require('../models/Firm');
const path = require('path');

// Set up multer storage for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Add a new product
const addProduct = async (req, res) => {
    try {
        // Destructure the request body
        const { productName, price, category, bestseller, description } = req.body;

        // Check for required fields
        if (!productName || !price || !category || !description) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Get the firm ID from the request parameters
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json({ error: "No firm found" });
        }

        // Handle image upload
        const image = req.file ? req.file.filename : undefined;

        // Create a new product
        const product = new Product({
            productName,
            price,
            category,
            bestseller,
            description,
            image,
            firm: firm._id
        });

        // Save the product to the database
        const savedProduct = await product.save();
        
        // Update the firm's product list
        firm.products.push(savedProduct._id); // Save only the product ID
        await firm.save();

        // Return the saved product
        res.status(201).json({ message: "Product added successfully", product: savedProduct });

    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get products by firm
const getProductByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json({ error: "No firm found" });
        }

        // Retrieve products associated with the firm
        const products = await Product.find({ firm: firmId });

        res.status(200).json({ firmName: firm.firmName, products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a product by ID
const deleteProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: "No product found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Export the module
module.exports = { addProduct: [upload.single('image'), addProduct], getProductByFirm, deleteProductById };
