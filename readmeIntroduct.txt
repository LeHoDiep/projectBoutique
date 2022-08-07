1.xây dựng mô hình cơ bản gồm webpack | babel
2.xây dựng gulp hỗ trợ thay thế html -> pug | css -> sass| tối ưu hóa img
3.hướng dẫn sử dụng mongoDB.js
4.thay thế mongoDB bằng công nghệ mongoose để chuẩn bị cho việc viết api
    tức là chê mongoDB , cài đặt mongoose (demo mongoose thông qua productData.js ,
                                             quản lý data của table product)
    4.1 cài npm i express --save để thao tác với server tạo ra các api 
    tạo server bằng nodemon, webpack các thử trước, nói sơ về mô hình tạo api , routes

    rồi demo mongoose
    cài đặt mongoose (demo mongoose thông qua productData.js ,
                                             quản lý data của table product)
                    export table Product để file server.js sử dụng tạo api
        quay qua demo tiếp server.js
        sau khi hoàn thiện bộ api, ta qua http để làm bộ http(controller) phù hợp với bộ api đã tạo

--demo thêm ảnh vào dựa trên import

--sau khi đã test bundle thành công 
--mình cho folder này kết nối với git bằng lệnh git init (tạo thư mục .git để dùng được các comandline)
--tạo repository trên github trước, rồi liên kết với folder có sẵn này bằng câu lệnh
 	git remote add origin https://github.com/LeHoDiep/0-ProjectStart.git
--nếu bạn chưa đăng nhập account thì nên đăng nhập 
--sau đó dùng lệnh:  git config --global --add safe.directory H:/04-myJavascriptTours/nodejs/0-ProjectStart
--	để xác thực tính an toàn của project (github sợ mình đưa code cho người lạ)
	--nếu làm đúng thì mình sẽ có hiển thị nhánh (master)

--đẩy project lên github bằng cú pháp: git add .  xác nhận những thứ đã thêm
					git commit -m "sms" ghi chú lại những gì đã làm
					nếu ép khai tên thì cứ khai tên bth
--					git push origin branch
$ git push origin master
fatal: 'origin' does not appear to be a git repository
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
--lỗi này là : muốn hỏi mình rằng đã liên kết repository chưa ? $ git remote add origin https://github.com/LeHoDiep/0-ProjectStart.git 
--sau đó chạy lại push là xong

--để sử dụng code trên máy khác, nhớ cập nhật lại nodejs ở phiên bản mới nhất để trách code k chạy được

20/7/2022
thêm 'npm:build cho task webapp:dev của package'
đã tạo thư mục js cho src
thêm watch:true cho webpack để nó tự build mỗi khi lưu thay đổi
đổi output của webpack và đổi server static về public
21/7/2022
làm from reg
cần bodyParse để gữi body lên api giúp api nhận được res status
dùng bcrypt để mã hóa password
22/7/2022
vẫn làm from và dùng jwt để xác thực
Client -> server: server phải làm cách nào đó xác thực được người gữi request là api
vì sao lại cần xác thực : server là máy tính trung tâm  mà mình điều kiển
client : là máy của người dùng mình không thể xác thực là ai được
có 2 cách mà client xác thực
1. clinent-itseft: client làm cách gì đó chứng minh mình trên request (JWT)
2. client-Server: chia sẽ 1 bí mật nào đó mà server biết (Cookie)-cách mà fb hay dùng nè
        --2 bên cùng lưu lại pwd thì khỏi cần đăng nhập các thứ các thứ

JWT sẽ có cấu trúc là header(tiêu đề).payload(khối data truyền đi).signature(chữ ký người gữi)
ưu điểm của JWT là không cần phải lưu trữ 
---
tạo login api cho server
tạo login.page
phát sinh vấn đề với các file js, ta cần thêm các file js riêng cho từng page
    nếu cần chung ta sẽ bỏ vào index.js, còn lại ta bỏ riêng vào folder js 
    thế nên ta sẽ dùng npm install --save-dev gulp-uglify để tối ưu hóa các file js 
    và render các file js đó và public/js
    chỉnh lại file gulp thêm tash minifyjs, và cài vào watch
    khi script cho các js lẽ đó thêm type='module' để có thể dùng cú pháp import
    clean-js và minifyjs hoạt động không tốt, có thể là watch bị lỗi đã khắc phục
    tiếp tục làm api login dùng jwt bằng : $ npm install jsonwebtoken
    --
--upload ảnh cần 
npm install express-handlebars --save
npm install multer --save
    