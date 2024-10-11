const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    category: {
        type: [
            {
                type: String,
                enum: [
                    'engine-parts',
                    'transmission-parts',
                    'suspension-components',
                    'braking-system',
                    'electrical-components',
                    'cooling-system',
                    'exhaust-system',
                    'fuel-system',
                    'steering-and-suspension',
                    'tires-and-wheels',
                    'body-parts',
                    'interior-accessories',
                    'exterior-accessories',
                    'performance-parts',
                    'safety-equipment',
                    'maintenance-and-repair',
                    'lighting-and-indicators',
                    'detailing-products',
                    'vehicle-care',
                    'miscellaneous'
                ]
            }
        ]
    },
    image: {
        type: String
    },
    bestSeller:{
        type: String
    },
    usage: {
        type: String
    },
    description:{
        type:String
    },
    firm: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Firm'
    }]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;