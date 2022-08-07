const mongoose = require('mongoose')
//--------------------
//mình cần sử dụng Schema để  thao tác với table, Schema là đại diện của 1 collection trong mongoose
const Schema = mongoose.Schema//tạo Schema
const Objectid = Schema.Objectid;
//trong đây xem mỗi table là 1 đối tượng, thay vì create table, ngta sẽ tạo object như sau
//tạo bản lưu các product
//dùng Schame tạo các thiết lập cho bản
const schameProduct = new Schema({
    proName: {type: String, required: true},
    proPrice: {type: Number},
    proImg: {data: Buffer, contentType: String},
    proDesc:{type: String},
    proType:{type: String}
})

tblProduct = mongoose.model('products', schameProduct)
//--------------------------------nameModel, schame tham chiếu
//nếu nameModel có rồi trong mongoDB thì nó sẽ liên kết, ta có thể query Product Collection
//                       thông qua tblProduct
//nếu nameModel chưa có thì nó dựa theo schameProduct tạo ra 1 collection mới trong mongoDB

module.exports = tblProduct //ném tblProduct ra ngoài cho file server sử dụng để viết api
//  giờ mình qua server mình viết api cho vui

