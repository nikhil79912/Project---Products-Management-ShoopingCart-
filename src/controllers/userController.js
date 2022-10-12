const mongoose = require('mongoose')
const userModel = require("../models/userModel")
const bcrypt = require("bcrypt");
const validation = require("../validations/validation")
const aws = require('aws-sdk')
const jwt = require('jsonwebtoken')



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


const createUser = async function (req, res) {
    
        let data = req.body;
       // console.log(data)
       let { fname, lname, email, password, phone, address, profileImage } = data

       if (!validation.isValidRequestBody(data)) 
        return res.status(400).send({ status: false, msg: "please provide  details" })

        if (!validation.isValid(fname)) 
        return res.status(400).send({ status: false, message: "first name is required or not valid" })

        if (!validation.isValid(lname)) 
        return res.status(400).send({ status: false, message: "last name is required or not valid" })

        //============================================EMAIL====================================================

        if (!validation.isValid(email)) 
        return res.status(400).send({ status: false, message: "email is required or not valid" })

        if (!validation.isValidEmail(email)) 
        return res.status(400).send({ status: false, message: "email is not valid" })

        let checkEmail = await userModel.findOne({ email: email })

        if (checkEmail) return res.status(409).send({ status: false, msg: "email already exist" })

        //==========================================PASSWORD================================================

        if (!validation.isValid(password)) 
        return res.status(400).send({ status: false, message: "Pasworrd is required or not valid" })

        if (!validation.isValidPassword(password)) 
        return res.status(400).send({ status: false, message: "Password length should be 8 to 15 digits and enter atleast one uppercase or lowercase" })

    //===========================================PHONE=================================================
    if (!validation.isValid(phone)) 
    return res.status(400).send({ status: false, message: "phone is required or not valid" })

    if (!validation.isValidNumber(phone)) 
    return res.status(400).send({ status: false, message: "phone number is not valid" })

    let checkPhone = await userModel.findOne({ phone: phone })

    if (checkPhone) return res.status(409).send({ status: false, msg: "Phone already exist" })
      
    //===========================================ADDRESS==============================================
    if (!address) return res.status(400).send({ status: false, msg: "address requried" })
    // var addresss = JSON.parse(address)


    if (!validation.isValid(address.shipping.street)) 
    return res.status(400).send({ status: false, message: "street field is required or not valid" })

    if (!validation.isValid(address.shipping.city)) 
    return res.status(400).send({ status: false, message: "city field is required or not valid" })

    if (!validation.isValid(address.shipping.pincode)) 
    return res.status(400).send({ status: false, message: "pincode field is required or not valid" })

    if (!validation.isValidPincode(address.shipping.pincode)) 
    return res.status(400).send({ status: false, message: "PIN code should contain 6 digits only " })




    if (!validation.isValid(address.billing.street)) 
    return res.status(400).send({ status: false, message: "street field is required or not valid" })

    if (!validation.isValid(address.billing.city)) 
    return res.status(400).send({ status: false, message: "city field is required or not valid" })

    if (!validation.isValid(address.billing.pincode)) 
    return res.status(400).send({ status: false, message: "pincode field is required or not valid" })

    if (!validation.isValidPincode(address.billing.pincode)) 
    return res.status(400).send({ status: false, message: "PIN code should contain 6 digits only " })

      
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(data.password,salt)
      data.password = hashedPassword


      let createData = await userModel.create(data)
      console.log(createData)

      

      let files= req.files
        if(files && files.length>0){
           let uploadedFileURL= await uploadFile( files[0] )  

            createData.profileImage = uploadedFileURL
             console.log(uploadedFileURL)

            res.send({status:true,data:createData})
    
        
        }    
        
    }



const loginUser = async function (req, res) {
    try {
  
      const requestBody = req.body;
  
      //-----------validating request body----------
  
      if (!validation.isValidRequestBody(requestBody)) {
        return res.status(400).send({
          status: false,
          message: " Please provide login credentials",
        });
      }
  
      //-----------destructuring--------------------
  
      let { email, password } = requestBody;
  
      //------------email validation-----------------
      if (!email) {
        return res.status(400).send({
          status: false,
          message: `Email is required`
        });
      }
      if (!validation.isValidEmail(email)) {
        return res.status(400).send({
          status: false,
          message: `Provide valid email address`,
        });
      }
  
      //------------password validation-----------------
  
      if (!password) {
        return res.status(400).send({
          status: false,
          message: `Password is required`
        });
      }
      // if (!validator.isValidPassword(password)) {
      //   return res.status(400).send({
      //     status: false,
      //     message: "Please enter a valid password"
      //   });
      // }
  
      let user = await userModel.findOne({email : email})
      if (!user) {
        return res.status(400).send({ status: false, message: "Invalid credentials" })
      }

      let userPass = user.password
      let checkPass = await bcrypt.compare(password,userPass)
      if(!checkPass){return res.status(400).send({status : false,message: "Invalid password"})}
      //---------------- token creation--------------
  
      let token = jwt.sign(
        {
          UserId: user._id.toString(),
          Team: "Group 66",
          organisation: "FunctionUp"
  
        },
        "functionup-plutonium-blogging-Project1-secret-key", { expiresIn: '1h' }
      );
  
      res.send({ status: true, msg: "login successful", data: { token: token, userId: user._id } });
  
    } catch (error) {
      return res.status(500).send({ status: false, msg: error.message })
    }
  };


  //-----------------------------------------------------------------------------------

  const getUser =async function(req,res){
    try{
     const userId =req.params.userId
    //  console.log(userId)
 
 
     if(!validation.isValidObjectId(userId))
     return res.status(400).send({status:false, message:"user id is not valid"})
 
     const user = await userModel.findById(userId)
     
     if(!user)
     return res.status(400).send({status:false, message:"user does not exist"})
 
     return res.status(200).send({status:true, msssage:"user profile Details", data:user})
     
 
 
    }catch(err){
     return res.status(500).send({status:false, msg:err.message})
    }
 
 }
 
 
  
  
  
  module.exports = { createUser,loginUser,getUser }