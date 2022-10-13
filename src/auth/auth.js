const userModel = require("../models/userModel");
const {isValidObjectId} = require("../validations/validation")
const jwt = require('jsonwebtoken')
const authentication = (req, res, next) => {
    try {

        let bearer = req.headers["authorization"]
        if (!bearer)return res.status(401).send({ status: false, msg: "token is required" });
         let token = bearer.split(' ')[1]
         console.log(token)
        
        jwt.verify(token,"functionup-plutonium-productsManagement-Project66-secret-key", (error, decoded) =>{
            if (error) {
                 let message=(error.message=="jwt expired"?"your token is expired,please login again":"Invalid Token")
                 return res.status(401).send({ status: false, msg:message });
            } else {
              req.token = decoded;
              req.headers.userId = decoded.userId
                next(); }
        });
    } catch (error) {
        res.status(500).send({ status: false, err: error.message });
    }
};


const authorization = async (req,res,next)=>{
    try {
        let decodedToken=req.token
        let userid=req.params.userId
        if(!isValidObjectId(userid)){return res.status(400).send({status:false,message:"plz enter valid userId"})}
        if(userid!=decodedToken.UserId){
            return res.status(403).send({status:false,message:"you are not authorised"})
        }else{
            next()
        }
    } catch (error) {
        
    }
}
module.exports={authentication,authorization}