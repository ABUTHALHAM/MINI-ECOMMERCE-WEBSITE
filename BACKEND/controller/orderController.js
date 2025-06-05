const orderModel = require("../models/orderModel");

exports.createOrder = async (req, res, next) => {
    try {
        const cartItems = req.body.cartItems;  // IMPORTANT: access cartItems property

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty or invalid format",
            });
        }

        // Calculate total amount (make sure price and qty are numbers)
        const amount = parseFloat(
            cartItems.reduce((acc, item) => {
                // parse price and qty to number safely
                const price = parseFloat(item.product.price);
                const qty = parseInt(item.qty, 10);
                if (isNaN(price) || isNaN(qty)) throw new Error('Invalid price or quantity');
                return acc + price * qty;
            }, 0).toFixed(2)
        );

        const status = "pending";

        const order = await orderModel.create({ cartItems, amount, status });

        console.log("Cart Items:", cartItems);
        console.log("Total Amount:", amount);

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            amount,
            order,
        });
    } catch (error) {
        console.error("Order creation error:", error.stack);
        res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.message,
        });
    }
};
