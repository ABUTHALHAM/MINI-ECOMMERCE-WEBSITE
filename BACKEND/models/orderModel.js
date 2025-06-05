const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    cartItems: [
        {
            product: {
                name: String,
                price: String,
                images: [{ image: String }],
                _id: mongoose.Schema.Types.ObjectId,
            },
            qty: Number,
        }
    ],
    amount: String,
    status: {
        type: String,
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;
