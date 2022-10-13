//-------------------------------------------------importing module---------------------------------------------------

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../auth/auth")
const ProductController = require('../controllers/productController')
//-------------------------------------------------------------------------------------------------------------

//------------ user registration -----------------
router.post("/register", userController.createUser);

//------------------- user login -----------------
router.post("/login", userController.loginUser);

//------------ get user by user ID ----------------
router.get("/user/:userId/profile",auth.authentication,userController.getUser)

//----------------- update books ------------------
router.put("/user/:userId/profile",auth.authentication, auth.authorization, userController.updateUser)

//------------ get product by product ID -----------
router.get("/products/:productId" ,ProductController.getProductById)

//--------------delete  product by product ID-------
router.delete("/products/:productId" ,ProductController.deleteProductById)

//------------ edge case for wrong route------------
router.all("/*",(req,res)=>{res.status(400).send({status:false,message:"Endpoint is not correct"})})


//-------------------------------------------------exporting router---------------------------------------------------

module.exports = router;