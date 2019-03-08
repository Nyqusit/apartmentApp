const express = require('express');
const app = express();
const http = require('http').Server(app).listen(3000,'10.0.0.43');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const layouts  = require('express-ejs-layouts');

mongoose.connect('mongodb://localhost:27017/ecommerce',{useNewUrlParser: true});
const db = mongoose.connection;

db.on('error',(err)=>{
  console.log(err);
})

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use([
  bodyParser.urlencoded({extended: false}),
  bodyParser.json(),
  express.static(path.join(__dirname,'public')),
  fileUpload(),
  layouts
]);

app.use('/apartment', require('./routes/apartment'));
app.use('/users', require('./routes/users'));
app.use('/shop', require('./routes/shop'));

app.get('/', (req,res)=>{
  res.end('so this is home.. ahh');
})
