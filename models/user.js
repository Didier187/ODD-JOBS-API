const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim: true,
        minlength:6,
        maxlength:100
    },
    email:{
        type:String,
        required:true,
        minlength:5,
        maxlength:255,
        unique:true
    },
    password:{
        type:String,
        minlength:10,
        maxlength:1024,
        required:true
    }
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, email: this.email},config.get('JWTPRIVATEKEY'))
    return token
}

const User = mongoose.model('User', userSchema)

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(100).required(),
        email:Joi.string().trim().min(5).max(255).required().email(),
        password:Joi.string().min(10).max(255).required()
    })
    return schema.validate(user)
}

module.exports.User = User
module.exports.validateUser = validateUser