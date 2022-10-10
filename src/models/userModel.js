//---------------------------------------importing modules--------------------------------------------
const mongoose = require("mongoose")

//----------------------------------------Creating Schema---------------------------------------------


const userSchema = new mongoose.Schema({


    fname: {
        type: String,
        required: true,
    },

    lname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    profileImage: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        require: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
    // encrypted password
    address: {
        shipping: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            pincode: { type: String, required: true }
        },

        billing: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            pincode: { type: String, required: true }
        },
    },

},
    { timestamps: true });

//---------------------------------- exporting  the model here--------------------------------------

module.exports = mongoose.model("User", userSchema);