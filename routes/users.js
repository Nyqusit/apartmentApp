const express = require('express');
const router = express.Router();
const app = express();
const hash = require('brown-hash/hasher.js');
const models = require('../models');
const User = models.user;
const Apartment = models.apartment;
const mkdirp = require('mkdirp');
const path = require('path');
const uploadPath = '/media/nyquist/Scay_Tery/dev/web/node_js/CRUD_ecomerce_project_1/CRUD_Ecommerce_15/public/photos';

let userAccess = false;
let userInfo = {};

router.get('/login',(req,res)=>{
  res.render('login',{loginError:"please login"});
})

router.post('/login',(req,res)=>{
  let query = {email:req.body.inputEmail};
  User.find(query,(err,user)=>{
    if(err) console.log(err);

    let salt = hash.createSalt();
    let hashedPassword = hash.createHash(req.body.inputPassword)

    if(user.length > 0  &&  hash.createHash(salt+hashedPassword) === hash.createHash(salt+user[0].password)){
      userInfo = JSON.parse(JSON.stringify(user[0]));
      userAccess = true;
      res.redirect('newEntry')
    }else
      res.render('login',{loginError:"login information was incorrect"});
  });
});

router.get('/register',(req,res)=>{
  res.render('register',{registerError:"Please input your credentials"});
});

router.post('/register', (req,res)=>{
  User.find({email:req.body.email},(err,user)=>{
      if(user.length === 0 && !err){
        req.body.password = hash.createHash(req.body.password);
        req.body.numberOfApartments = 0;
        let newUser = new User(req.body);
        newUser.save((err)=>{
          if(!err){
            mkdirp(path.join(uploadPath,req.body.email),(err)=>{
              if(err) console.log(err);
            });
            res.redirect('/');
          }
          console.log(err);
        });
      }else{
        res.render('register',{registerError:"That user already exist"});
      };
  });
});


//routes only available if signed in

router.get('/newEntry',(req,res)=>{
  if(userAccess){
    res.sendFile('/media/nyquist/Scay_Tery/dev/web/node_js/CRUD_ecomerce_project_1/CRUD_Ecommerce_15/views/newEntry.html');
  }else{
    res.render('accessDenied');
  }
});

router.post('/newEntry',(req,res)=>{
  if(userAccess){
    const fileNames = ["livingroom.jpg","diningroom.jpg","bedroom.jpg","livingroom2.jpg"];
    userInfo.numberOfApartments++;
    let picPath = path.join(uploadPath,userInfo.email,userInfo.numberOfApartments.toString());

    mkdirp(picPath,(err)=>{
      if(err) console.log(err);
    });

    req.body.owner = userInfo.email;
    req.body.apartmentNumber = userInfo.numberOfApartments;
    let newAppartment = new Apartment(req.body);
    newAppartment.save((err)=>{
        if(err) console.log(err);
    });
    User.update({email:userInfo.email},userInfo,(err)=>{
      if(err)
      console.log(err)
    })

    Object.values(req.files).forEach((files,idx)=>{
      files.mv(path.join(picPath,fileNames[idx]),(err)=>{
          if(err)console.log(err);
      });
    });

    res.send('done');
  }
 if(!userAccess){
  res.render('accessDenied');
  }
})

module.exports = router;