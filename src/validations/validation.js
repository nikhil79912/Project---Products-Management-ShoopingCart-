const mongoose = require('mongoose')
// //-------------------------request body validation------------------------------------

// const isValidRequestBody = function (requestBody) {
//     return Object.keys(requestBody).length > 0;
//   };
// //----------------------------email validation-----------------------------------------

// const isValidEmail = function (value) {
//     if (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(value)) return true;
//     return false;
//   };

// //---------------------------password validation---------------------------------------
//   const isValidPassword = function (value) {
//     if (
//       /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(value)
//     )
//       return true;
//     return false;
//   };

  const isValid = function (value) {
    
    if (typeof value === "undefined" || typeof value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidNumber = function (value) {
    const noNumber = /^(\+91[\-\s]?)?[0]?(91)?[6-9]\d{9}$/g
    if (typeof value !== 'string') return false
    if (noNumber.test(value) === false) return false
    return true
}


const isValidEmail = function (value) {
    let mailFormat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
    // Checking if the inputted email id perfectely formatted or not
    if (!(value.match(mailFormat))) return false
    return true

}

const isValidRequestBody = function (requestbody) {
    return Object.keys(requestbody).length > 0;
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidPincode = function (value) {
    let pinCodeValidation = /^[0-9]{6}$/;
    if (!(pinCodeValidation.test(value))) return false
    return true
}

const isValidPassword = function(value){
    let passwordPattern = /^[a-zA-Z0-9!@#$%&*]{8,15}$/;
        if (!(passwordPattern.test(value))) return false
        return true
}


module.exports = { isValid, isValidEmail, isValidNumber, isValidRequestBody, isValidObjectId, isValidPincode,isValidPassword }
  // module.exports = {isValidRequestBody,isValidEmail,isValidPassword}