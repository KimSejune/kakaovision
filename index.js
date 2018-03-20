const express = require('express')
const axios = require('axios')
const fileType = require('file-type')
const multer = require('multer')
const cors = require('cors')
const app = express()

const upload = multer({
  storage: multer.memoryStorage()
})

app.set('view engine', 'pug')
app.use(cors())

function kakaoVision(fileBuffer) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: 'https://kapi.kakao.com/v1/vision/face/detect',
      data: {
        file: `${fileBuffer}`
      },
      headers: {
        'Authorization': 'KakaoAK cd05963448d0dcac73dfbe01e690b3da',
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })

}




app.get('/', (req, res) => {
  res.render('index.pug')
})

app.get('/vision', (req, res) => {
  res.render('index-debug.pug')
})

app.post('/vision', upload.single('imagefile'), (req, res) => {
  kakaoVision(req.file.buffer)
    .then(result => {
      res.send(result)
    })
})

app.listen(5000, () => {
  console.log('connect!!')
})