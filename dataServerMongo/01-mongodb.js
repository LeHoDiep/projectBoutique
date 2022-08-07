/*https://www.mongodb.com/
chọn sign in / sign up
tạo database trên mongoDB
id của DBMongo: PiedTeamDemo
pwd: Ygy2Z08rdJNb1i8x

--trong mongoDB, bản được gọi là Collection, row gọi là document

chọn colection để đăng nhập vào thư mục lưu trử, và tạo collection mới, chọn "add my own data"

vào collection vừa tạo, insert 1 document , có thể tùy chỉnh các cột 

thêm 1 vài data xong
ta sẽ qua mục database Access để tạo user và cấp quyền

để ý mục build in role để chọn cấp quyền

mình phải thêm địa chỉ IP mới có thể truy cập vào mongoDB , chọn mục network access
--mình có thể set truy cập theo ip, hoặc cho phép truy cập từ mọi nơi

-----------------------------------
conect đến database , chọn conect, ta sẽ có 3 cổng kết nối (kết nối qua mongo khác, kết nối qua app, kết nối qua phầm mềm ứng dụng compass), 
mình làm app , nên mình sẽ chọn kết nối qua app, thay vì chọn 2 cái còn lại
copy lại đường dẫn, nó là link để mình kết nối ứng dụng
mongodb+srv://PiedTeamDemo:<password>@piedteamdemo.c22y5.mongodb.net/?retryWrites=true&w=majority
đường dẫn này cần phải chỉnh nhiều để sử dụng
--------
mongodb+srv://PiedTeamDemo:Ygy2Z08rdJNb1i8x@piedteamdemo.c22y5.mongodb.net/DB_PiedTeamDemo?retryWrites=true&w=majority
---------------------------................--------------------------------................---------------------------

vào dự án frontend
tạo file mongodb.js đồng cấp với webpack.config.js
cài đặt mongoDB bằng npm : npm i mongodb --save (--save để lưu vào package)*/


//mongoDB có phân biệt hoa thường nha
const { MongoClient } = require('mongodb');//destructuring chỉ lấy ra MongoClient
// có thể viết cùi hơn const MongoClient =  require('mongodb').MongoClient;
const pwdMongoDB = 'Ygy2Z08rdJNb1i8x'
const nameDBMongoDB = 'DB_PiedTeamDemo'
// lấy đường dẫn liên kết vào
const url = `mongodb+srv://PiedTeamDemo:${pwdMongoDB}@piedteamdemo.c22y5.mongodb.net/${nameDBMongoDB}?retryWrites=true&w=majority`;

//tạo ra đối tượng mongo, bằng url
const mongo = new MongoClient(url,{ 
    useNewUrlParser: true, //useNewUrlParser giúp mình xác nhận url hợp lệ(nó tự phân tích cú pháp url)
    useUnifiedTopology: true,//thằng này giúp tìm server 
});

const db = ''
//việc kết nối server có thể mất nhiều thời gian, code sẽ bị bất đồng bộ
//xử lý bằng async await
//kết nối mongo
const connectMongo = async ()=>{
//-----conect
    await  mongo.connect(); //nếu kết nối không được thì phát sinh lỗi(asyncAwait k catch lỗi)
    console.log('mongoDB Contected');
    // *****
    // quẹo lựa data trong này
    // tìm đến database của mình
    var DB_PiedTeamDemo =  mongo.db(DB_PiedTeamDemo)//use DB_PiedTeamDemo
    // tạo collection(tạo table trong db)
    // createCollection("tênCollection")
    // await DB_PiedTeamDemo.createCollection("Employee")//tạo bảng employee


//-----insertdata
    //tạo danh sách các object để bỏ vào employee
    var EmpList = [
        {
            name : 'Điệp vip pro',
            point: '10'
        },
        {
            name : 'Điệp vip pro 1',
            point: '1'
        },
        {
            name : 'Điệp vip pro 2',
            point: '2'
        }
    ]
    //--add: insert document(object|row) vào
    //DB_PiedTeamDemo.collection('Employee') giống như SELECT * FROM Employee
    // await DB_PiedTeamDemo.collection('Employee').insertMany(EmpList)
    //phải có await nha, chờ ngta insert xong mới finish đóng server nha má
    
    
    
//-------read: lấy dữ liệu xuống xem sao
    const data =  await DB_PiedTeamDemo.collection('Employee').find().toArray()
    
    //.find(condition dạng collations)
    //collation là gì: https://www.mongodb.com/docs/drivers/node/current/fundamentals/collations/
    //.toArray() biến kết quả tìm được thành code
    console.log(data); //in hoặc return cho .then và in ra

//----delete:Tìm và xóa đối tượng
    // đầu tiên mình cần 1 query(1 điều kiện để truy vấn đối tượng)
    //vd: truy vấn đối tượng có point == 2
    // const query = {point : "2"}
    // //xóa với .deleteOne(query)
    // await DB_PiedTeamDemo.collection('Employee').deleteOne(query)

//-------update: cập nhật dữ liệu
    //ví dụ: cập nhật  điểm của đối tượng theo name
    //viết query cho name: lấy ra thằng có name là : 'Điệp vip pro'
    const query = {name: 'Điệp vip pro'}
    //phần cần cập nhật: là điểm lên 12
    //dùng thuộc tính tên là $set
    const newValue = {
        $set:{point: '12'}
    }   
    //cập nhật
    // await DB_PiedTeamDemo.collection('Employee').updateOne(query,newValue)

//-------sort: sắp xếp theo 1 tiêu chí nào đó
    // tạo biến orderBy lưu cột muốn sort và asc(1) hay desc(-1)
    const compareFn = {name: -1}
    const dataSorted = await DB_PiedTeamDemo.collection('Employee').find().sort(compareFn).toArray()
    //.find() lấy danh sách
    //.sort(compareFn) bỏ quy luật sắp xếp vào
    //.toArray() chuyển thành mảng xài cho tiện
    console.log(dataSorted)

//------search: tìm theo 1 tiêu chí nào đó
    const query1 = {name: 'Điệp vip pro'}
    const dataSearch = await DB_PiedTeamDemo.collection('Employee').find(query1).toArray()
    console.log(dataSearch)
    return 'done.'
}
connectMongo().then(res =>{
                    console.log(res)
               }).catch(error=>{
                    console.log(error)
               }).finally(() => mongo.close());

// thao tác với thư viện mongoDB cũng rất oke, nhưng mà giờ ngta có thư viện mới là mongose xài cũng rất oke
//      tạo được bản và viết API cũng tiện hơn
//
