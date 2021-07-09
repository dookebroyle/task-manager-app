const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User',{
    name:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        required: false,
        validate(value) {
            if (value < 0 || value > 122){
                throw new Error('Invalid age')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')){
                throw new Error('Password cannot include the word password.')
            }
            if(value.includes(' ')){
                throw new Error('Password cannot include spaces')
            }
        }
    }
})

module.exports = User