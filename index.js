const express = require('express');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4001;

dotEnv.config();
app.use(cors())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((error) => console.log(error)) 

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);

app.listen(PORT, () => {
    console.log(`server started and running at ${PORT}`);
});

app.use('/home', (req, res) => {
    res.send("<h1>Welcome to CAR95</h1>");
});