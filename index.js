const express = require("express");
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');

const app = express();
app.use(cors());


dotEnv.config();


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((error) => console.error('MongoDB connection error:', error));

const PORT = process.env.PORT || 4000;


app.use(express.json());

app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads', express.static('uploads'));


app.get('/', (req, res) => {
    res.send("<h1> Welcome to CAR95</h1>");
});


app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});


app.listen(PORT, () => {
    console.log(`Server started and running at ${PORT}`);
});
