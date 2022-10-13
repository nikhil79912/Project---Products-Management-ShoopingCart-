const mongoose = require('mongoose')
const userModel = require("../models/productModel")
const bcrypt = require("bcrypt");
const validation = require("../validations/validation")
const aws = require('aws-sdk')
const jwt = require('jsonwebtoken')

