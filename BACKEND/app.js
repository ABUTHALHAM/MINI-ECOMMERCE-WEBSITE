const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const connectDatabase = require("./config/connectDatabase")
const cors = require("cors");

// Load env variables
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const products = require("./routes/product");
const orders = require("./routes/order");

connectDatabase();

app.use("/api/v1/products", products);
app.use("/api/v1/orders", orders);


// Server
app.listen(process.env.PORT, () => {
    console.log(`Site is successfully running on port: http://localhost:${process.env.PORT} in ${process.env.NODE_ENV}`);
});
