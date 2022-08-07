const multer = require("multer");
const {GridFsStorage} = require("multer-gridfs-storage");
const crypto = require('crypto');
const path = require('path');   
const pwdMongoDB = "Ygy2Z08rdJNb1i8x";
const nameDBMongoDB = "DB_PiedTeamDemo";
const url = `mongodb+srv://PiedTeamDemo:${pwdMongoDB}@piedteamdemo.c22y5.mongodb.net/${nameDBMongoDB}?retryWrites=true&w=majority`;
const storage = new GridFsStorage({
    url: url,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => { 
        return new Promise((resolve, reject) => { 
          crypto.randomBytes(16, (err, buf) => { 
            if (err) {
              return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
              filename: filename, 
              bucketName: 'photos'
            };
            resolve(fileInfo);
          });
        });
      } 
})

module.exports = multer({ storage });