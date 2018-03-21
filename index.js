const express = require('express')
//const axios = require('axios')
const request = require("request");
const multer = require('multer')
const cors = require('cors')

const app = express()

const upload = multer({
  storage: multer.memoryStorage()
})

app.set('view engine', 'pug')
app.use(cors())

function kakaoVision(file) {
  return new Promise((resolve, reject) => {
    request.post({
      url:'https://kapi.kakao.com/v1/vision/face/detect',
      headers: {
        'authorization': 'KakaoAK cd05963448d0dcac73dfbe01e690b3da',
        'content-type': 'multipart/form-data'
       },
      formData: { 
        file: {
          value: file.buffer,
          options: {
            filename: file.originalname,
          }
        }
      },
    },(err, httpResponse, body) => {
      if (err) {
        reject(err);
      }
      resolve(body);
    });
  });
}

app.get('/', (req, res) => {
  res.render('index.pug')
})

app.get('/vision', (req, res) => {
  res.render('index-debug.pug')
})

app.post('/vision', upload.single('imagefile'), (req, res) => {
  kakaoVision(req.file)
    .then(result => {
      //console.log(result, '<< [ result ]');
      res.send(result);
    })
    .catch(err => {
      console.log(err, '<< [ err ]');
    })
})

app.listen(5000, () => {
  console.log('connect!!')
})