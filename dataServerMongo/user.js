const mongoose = require('mongoose')
const Schema = mongoose.Schema//tạo Schema
const Objectid = Schema.Objectid;
const schameUser = new Schema({
    userid: {type: String , required: true, unique: true},
    pwd: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    isAdmin: {type: Boolean, required: true, default: false},
})
tblUser = mongoose.model('user', schameUser)
module.exports = tblUser