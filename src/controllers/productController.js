//-------------------------------------------------importing module---------------------------------------------------

// const mongoose = require('mongoose')
// const userModel = require("../models/productModel")
// const bcrypt = require("bcrypt");
const validation = require("../validations/validation")
const aws = require('aws-sdk')
// const jwt = require('jsonwebtoken')
const productModel = require('../models/productModel')

//-----------------------------------------------------AWS---------------------------------------------------------------
aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        // this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: '2006-03-01' }); // we will be using the s3 service of aws

        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",  //HERE
            Key: "abc/" + file.originalname, //HERE 
            Body: file.buffer
        }


        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            return resolve(data.Location)
        })


    })
}


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


const updateProduct = async function (req, res) {
    const productId = req.params.productId

    if (!validation.isValidObjectId(productId)) {
        return res.status(400).send({ status: false, message: "productId is not valid" })
    }

    const checkProductId = await productModel.findOne({ _id: productId, isDeleted: false })
    if (!checkProductId) {
        return res.status(404).send({ status: false, message: "Product ID not found" })
    }

    let data = { ...req.body }
    let files = req.files

    if (!validation.isValidRequestBody(data) && !files) {
        return res.status(400).send({ status: false, message: "Invalid request parameters. Please provide updating keys details" })
    }

    let { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage,  style, availableSizes, installments } = data

    let filter = {}

    if (data.hasOwnProperty("title")) {
        if (!validation.isValid(title)) {
            return res.status(400).send({ status: false, message: "please provide title in proper format" })
        }
        
        const checkTitle = await productModel.findOne({title: title})
        if(checkTitle){
            return res.status(400).send({status: false, message: "Title is already present, please use another title"})
        }
        filter.title = title
    }

    if (data.hasOwnProperty("description")) {
        if (!validation.isValid(description)) {
            return res.status(400).send({ status: false, message: "please provide description in proper format" })
        }
        filter.description = description
    }

    if (data.hasOwnProperty("price")) {
        if(!validation.isValidPrice(price)){
            return res.status(400).send({ status: false, message: "please enter valid price" })
        }
        filter.price = price
    }

    if (data.hasOwnProperty("currencyId")) {
        if (!validation.isValid(currencyId)) {
            return res.status(400).send({ status: false, message: "please provide currencyId in proper format" })
        }

        if (!validation.isValidName(currencyId)) {
            return res.status(400).send({ status: false, message: "please provide only alphabet in currencyId" })
        }
        filter.currencyId = currencyId.toUpperCase()
    }

    if (data.hasOwnProperty("currencyFormat")) {
        if (!validation.isValid(currencyFormat)) {
            return res.status(400).send({ status: false, message: "please provide currencyFormat in proper format" })
        }
        filter.currencyFormat = currencyFormat
    }

    if (data.hasOwnProperty("isFreeShipping")) {
        if (!validation.isValidBoolean(isFreeShipping)) {
            return res.status(400).send({ status: false, message: "please provide only true or false" })
        }
        filter.isFreeShipping = isFreeShipping
    }

    if (data.hasOwnProperty("productImage")) {
        if (!files.length) {
            return res.status(400).send({ status: false, message: "please select some file" })
        }
    }

    if (data.hasOwnProperty("style")) {
        if (!validation.isValid(style)) {
            return res.status(400).send({ status: false, message: "please provide style in proper format" })
        }
        filter.style = style
    }

    if (data.hasOwnProperty("availableSizes")) {
        if (!validation.isValidSize(availableSizes)) {
            return res.status(400).send({ status: false, message: `please provide only sizes `})
        }
        filter.availableSizes = availableSizes.toUpperCase()
    }

    if (data.hasOwnProperty("installments")) {
        if (!validation.isValidNum(installments)) {
            return res.status(400).send({ status: false, message: `please provide only number `})
        }
        filter.installments = installments
    }

    if (files && files.length > 0) {
        let uploadedFileURL = await uploadFile(files[0])
        filter.productImage = uploadedFileURL
    }

    const update = await productModel.findOneAndUpdate(
        { _id: productId },
        { $set: filter },
        { new: true })
    return res.status(200).send({ status: true, message: "Product Updated Successfully", data: update })
}


//------------------------------export modules--------------------------------------------------------------------


module.exports={ getProductById, deleteProductById, updateProduct }

