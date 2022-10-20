// kết nối mongodb
const mongoose = require("mongoose"); //import trước
//kết nối với server
const pwdMongoDB = "CAwbgtSfxbxE5Rbi";
const nameDBMongoDB = "DB_PiedTeamDemo";
const multer = require('multer'); //xử lý file middleware
// lấy đường dẫn liên kết vào
const url = `mongodb+srv://PiedTeamDemo:${pwdMongoDB}@piedteamdemo.c22y5.mongodb.net/${nameDBMongoDB}?retryWrites=true&w=majority`;
const conectMongooes = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true, //useNewUrlParser giúp mình xác nhận url hợp lệ(nó tự phân tích cú pháp url)
            useUnifiedTopology: true, //thằng này giúp tìm server
        });
        console.log("kết nối server mongodb thành công");
    } catch (error) {
        console.log("Kết nối server mongodb thất bại vì ", error);
    }
};
conectMongooes();
// kết nối mongodb
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParse = require("body-parser");
//thiết lập truy cập cho các trang web khác
//cài đặt cors
const corsOptions = {
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParse.json());
app.set('views', './src/page'); // Thư mục views nằm cùng cấp với file app.js
app.set('view engine', 'pug'); // Sử dụng pug làm view engine
// http://localhost:4000/page/register.html
// login
//Routes
// app.get('/', (req,res)=>{
//     res.send('home')
// })
//get(lấy dữ liệu), //post(thêm dữ liệu) //delete(xóa dữ liệu), patch(update dữ liệu)
//  '/' là routes chỉ mục

//middlewares: thằng này là thằng trung gian giữa việc tiếp nhận các dữ liệu trả về từ routes và
//đem đến cho người dùng, hoặc lưu trữ
// register
// 1. liên kết table user
const tbluser = require("./dataServerMongo/user");
// 2.khi ngta đăng ký thì username và password sẽ được gữi lên
//      mình cần mã hóa nó để bảo mật: ta dùng bcryptjs
//      cài npm install bcryptjs
const bcrypt = require("bcryptjs");
app.post("/api/register", async (req, res) => {
    // console.log(req.body) //xem thử có ổn không
    // mã hóa password
    const { username, password: plainTextPassword, phoneNumber } = req.body; //phân rã body để lấy username, password
    if (!username || typeof username !== "string") {
        return res.json({ status: "error", error: "invalid username" });
    }
    if (!plainTextPassword || typeof plainTextPassword !== "string") {
        return res.json({ status: "error", error: "invalid password" });
    }
    if (plainTextPassword.length < 6) {
        return res.json({
            status: "error",
            error: "Độ dài password của bạn không được nhỏ hơn 6",
        });
    }
    password = await bcrypt.hashSync(plainTextPassword, 10);
    try {
        const newUser = new tbluser({ userid: username, pwd: password, phoneNumber });
        const reponse = await newUser.save();
        console.log("user created succesfully:" + reponse);
    } catch (error) {
        // console.log(JSON.stringify(error)) //check sẽ thấy code 11000 là bị lỗi duplicate
        if ((error.code = 11000)) {
            console.log("creatiton is error:" + error.message);
            return res.json({
                status: "error",
                error: "Username already in use",
            });
        }
        throw error; //còn lại thì thường là sai đường dẫn
    }
    res.json({ status: "ok" });
});

// login api
const jwt = require("jsonwebtoken");
const JWT_SECRET = "ahihidocho";
app.post("/api/login", async (req, res) => {
    // res.json({status: 'ok'})
    // lấy username, và pwd từ request
    const { username, password } = req.body;
    const user = await tbluser.findOne({ userid: username }).lean();
 
    // nếu tìm k đc user nào dựa trên userid cả thì ngừng
    if(user == null) return res.json({status:"error", error:'Invalid username/password'})
    //kiểm tra xem có username và password mà thằng người dùng nhập không
    //bằng cách lôi tbl user ra check
    //password nhận vào là password thuần túy luôn, không phải đã được mã hóa, nên k so sánh được
    //password mỗi lần bcrypt.hashSync(plainTextPassword,10) sẽ ra khách nhau
    //nên mình phải thông qua hàm compare của bcrypt thay vì dùng == bth
    if(await bcrypt.compare(password, user.pwd)){//đúng pwd thì làm tiếp
        const token = jwt.sign({
            id: user._id,
            userid: user.userid
        },JWT_SECRET)
        // nếu đúng password thì gữi cho họ id và userid gói lại vào token
        //để bảo mật tốt hơn
        return res.json({status: 'ok', data: token})
    }else{//sai pwd thì báo sai rồi dừng lại
        return res.json({status: 'error', error:'Invalid username/password'})

    }
});

//change password
app.post('/api/change-infor', async(req,res)=>{
    const {newPhone,currentpwd,newpassword, token} = req.body

    try{
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id
        const currentInforUser = await tbluser.findOne({_id}).lean()
        if(await bcrypt.compare(currentpwd,currentInforUser.pwd)){
            const passwordHashed = await bcrypt.hashSync(newpassword, 10) 
            await tbluser.updateOne({_id}, {
                $set:{pwd: passwordHashed, phoneNumber: newPhone}
            })
            res.json({status:'ok'})
        }else{
            res.json({status:'error', error:'Current pwd is wrong'})
        }

        
        //dùng _id thu được trong xác thực để cập nhật password mới cho user
        //mã hóa password mới trước khi update

    }catch (error){
        console.log(error)
        res.json({status:'error', error:'con chó này cố hack :))'})
    }
    //truy ngược lại user thông quan việc xác thực token và jwt_secret
})

// getInforAccount
app.post('/api/get-infor-account', async(req,res)=>{
    const {token} = req.body
    try{
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id
        //dùng _id thu được trong xác thực để cập nhật password mới cho user
        //mã hóa password mới trước khi update
        const {isAdmin,phoneNumber,userid} = await tbluser.findOne({ _id, userid: user.userid }).lean();
        res.json({status:'ok', data: {isAdmin,phoneNumber,userid}})
    }catch (error){
        res.json({status:'error', error:'con chó này cố hack :))'})
    }
    //truy ngược lại user thông quan việc xác thực token và jwt_secret
})

//addNewProduct
const tblProduct = require("./dataServerMongo/productData"); //liên kết với table tblProduct
const { json } = require("body-parser");
const upload = require("./middleware/file-uploader.js");
require('fs');

const conn = mongoose.createConnection(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}); 
let gfs;
conn.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, { 
      bucketName: "photos"
    } )
});
app.post('/api/addNewProduct', upload.single("product-file"), async (req, res) => {
    const dataForm = {...req.body}
    try{
        const newProduct = new tblProduct({ proName: dataForm['product-name'],
                                             proPrice: dataForm['product-price'], 
                                             proImg: req.file.filename,
                                             proDesc: dataForm['product-desc'], 
                                             proType: dataForm['product-type']});
        const reponse = await newProduct.save();
    }catch(error){
        res.json({status:'error', error: 'lỗi cập nhật sản phẩm'})
    }

//    res.json({status:'ok', data:req.file.filename})
    res.render('dashboard');
})  

app.post('/api/file', upload.single("file"), (req, res) => {
   res.json({status:'ok', data:req.file.filename})
})  

app.post('/api/files', upload.array("files", 12), (req, res) => {
  res.send(req.files)
}) 
app.get("/api/get_image/:filename",(req, res) => {
    gfs.find({
       filename: req.params.filename
     }).toArray((err, files) => {
       if (!files || files.length === 0) {
         return res.status(404).json({
           err: "no files exist"
         });
       }
       gfs.openDownloadStreamByName(req.params.filename).pipe(res);
     }); 
});
app.delete('/api/del_image/:fileId', (req, res) => { //file_id
    gfs.delete(new mongoose.Types.ObjectId(req.params.fileId), (err, data) => {
      if (err) return res.status(404).json({ err: err.message }); 
      res.status(200).send();
    });
})


//cách dùng khá giống với mongoDB, ta sẽ dùng find để tìm kiếm đối tượng
// http://localhost:4000/product sẽ lấy được full danh sách của bản product
app.post("/api/products", async (req, res) => {
    try {
        const dataProduct = await tblProduct.find({});
        const img = new Buffer.from(dataProduct[0].proImg.data).toString('base64')
        console.log(img)

        res.json({status:'ok', data: dataProduct})
    } catch (error) {
        res.json({status:'error', error: 'Lỗi server trong quá trình lấy sản phẩm'})
    } 
});
//get Product theo id
app.get("/products/search/:id", async (req, res) => {
    try {
        const dataProduct = await tblProduct.find({ _id: req.params.id });
        res.send(dataProduct);
    } catch (error) {
        console.log("Can't Query Product by id");
    }
});
//insert http://localhost:4000/products/add/number1/9000
app.get(`/products/add/:proName/:proPrice`, async (req, res) => {
    try {
        const newPro = new tblProduct({
            proName: req.params.proName,
            proPrice: req.params.proPrice,
        });
        await newPro.save();
        res.send("data inserted");
    } catch (error) {
        console.log("Can't insert new Product");
    }
});
//delete
app.get(`/products/delete/:id/`, async (req, res) => {
    try {
        const dataProduct = await tblProduct.find({ _id: req.params.id });
        if (dataProduct != "") {
            await tblProduct.deleteOne({ _id: req.params.id });
            res.send("deleted" + dataProduct);
        } else {
            res.send("not found object to delete");
        }
    } catch (error) {
        res.send("Can't delete Product");
    }
});
//update:demo bằng cách tạo 1 form update bên index.pug
app.get(`/products/update`, async (req, res) => {
    try {
        const dataBeforeUpdate = await tblProduct.find({
            proName: req.query.proName,
        });
        if (dataBeforeUpdate != "") {
            await tblProduct.updateOne(
                { proName: req.query.proName },
                { proPrice: req.query.proPrice }
            );
            const dataAfterUpdate = await tblProduct.find({
                proName: req.query.proName,
            });
            res.send(dataAfterUpdate);
        } else {
            res.send("not found object to update");
        }
    } catch (error) {
        res.send("Can't updated Product");
    }
});

//------------------------------------------
//chỉnh cho server về tầng port 3000
app.listen(4000);
