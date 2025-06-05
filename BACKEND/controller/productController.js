const productModel = require("../models/productModel")



exports.getproduct = async(req,res,next) =>{
    const query = req.query.keyword ?{ name : {
        $regex : req.query.keyword,
        $options : "i"
    }} : {}
    const products = await productModel.find(query)
    res.json({
        success : true,
        products
    })
}

const mongoose = require("mongoose");

exports.getSingleProduct = async (req, res, next) => {
  try {
    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
