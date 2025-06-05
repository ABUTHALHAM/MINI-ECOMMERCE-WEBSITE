const express = require("express")
const { getproduct, getSingleProduct } = require("../controller/productController")
const router = express.Router()


router.route("/").get(getproduct);
router.route("/:id").get(getSingleProduct);


module.exports=router