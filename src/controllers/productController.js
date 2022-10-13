//-------------------------------------------------importing module---------------------------------------------------

// const mongoose = require('mongoose')
// const userModel = require("../models/productModel")
// const bcrypt = require("bcrypt");
const validation = require("../validations/validation")
// const aws = require('aws-sdk')
// const jwt = require('jsonwebtoken')
const productModel = require('../models/productModel')

//------------------------------------------ get("/products/:productId")-----------------------------------------

const getProductById = async function(req,res){
    try{
        const productId = req.params.productId
        
        if (!validation.isValidObjectId(productId)){
            return res.status(400).send({status:false,message:"Invalid product Id"})

        }
        
        const data = await productModel.findOne({isDeleted:false, _id:productId})
        if(!data){
            return res.status(404).send({status:false, message:"product not found"})
        }

        return res.status(200).send({status:true,message:"product get successfully",data:data})
        
   
    }catch(err){
        return res.status(500).send({status:false,message:err.message})
     }

}

//--------------------------------------delete product/delete("/products/:productId")----------------------------------

const deleteProductById = async (req, res) => {
    try {
        let productId = req.params.productId;

        if (!validation.isValidObjectId(productId)){
            return res.status(400).send({status:false,message:"Invalid product Id"})
        }

        let deleteByproductId = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false },
            { isDeleted: true, deletedAt: Date.now() }, { new: true })

        if (!deleteByproductId) { return res.status(404).send({ status: false, message: "this product is already deleted" }) }

        res.status(200).send({ status: true, message: 'Product Deleted Successfully' })

    } catch (error) {

        res.status(500).send({ status: 'error', error: error.message })
    }
}

//------------------------------export modules--------------------------------------------------------------------


module.exports={getProductById,deleteProductById}

