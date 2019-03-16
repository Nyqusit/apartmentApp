const express = require('express');
const router = express.Router();
const app = express();
const {createSalt,createHash} = require('../custom_modules/hasher.js');
const {User,Apartment} = require('../models');
const path = require('path');
const uploadPath = '/media/nyquist/Scay_Tery/dev/web/node_js/apart/16/public/users';
const fs = require('fs');

let userAccess =false;
let userInfo = {};

router.get('/login',(req,res)=>{
  res.render('login',{loginError:"please login"});
})

router.post('/login',(req,res)=>{
  let query = {email:req.body.inputEmail};
  User.find(query,(err,user)=>{
    if(err) console.log(err);

    let salt = createSalt();
    let hashedPassword = createHash(req.body.inputPassword)

    if(user.length > 0  &&  createHash(salt+hashedPassword) === createHash(salt+user[0].password)){
      userInfo = {};
      userInfo = JSON.parse(JSON.stringify(user[0]));
      userAccess = true;
      res.redirect('/users/me')
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
        req.body.password = createHash(req.body.password);
        req.body.numberOfApartments = 0;
        let newUser = new User(req.body);
        newUser.save((err)=>{
          if(!err){
              fs.mkdir(path.join(uploadPath,req.body.email), { recursive: false  }, (err) => {
                  if(err){
                      console.log(err)
                  }
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

function grant_access(path){
    let pat = path.match(/html$/g);

    if(userAccess){
        return path
    }else{
        //return 'accessDenied'
        if(pat == "html"){
            return '/media/nyquist/Scay_Tery/dev/web/node_js/apart/16/views/accessDenied.html'
        }else{
            return 'accessDenied'
        }
    }
}

router.get('/newEntry',(req,res)=>{
    let picPath = path.join(uploadPath,userInfo.email,"img");
    if(userInfo.numberOfApartments === 0){
        fs.mkdir(picPath,{recursive:false},(err)=>{
            console.log(err);
        })
    }
    res.sendFile(grant_access('/media/nyquist/Scay_Tery/dev/web/node_js/apart/16/views/newEntry.html'));
});

router.post('/newEntry',(req,res)=>{
    const fileNames = ["livingroom.jpg","diningroom.jpg","bedroom.jpg","livingroom2.jpg"];
    userInfo.numberOfApartments++;

    let currentPath = path.join(uploadPath,userInfo.email,"img",userInfo.numberOfApartments.toString());

    fs.mkdir(currentPath,{recursive:false},(err)=>{
        console.log(err);
    })

    Object.values(req.files).forEach((files,idx)=>{
        files.mv(path.join(currentPath,fileNames[idx]),(err)=>{
            if(err)console.log(err);
        });
    });

    User.updateOne({email:userInfo.email},userInfo)

    req.body.owner = userInfo.email;
    req.body.apartmentNumber = userInfo.numberOfApartments;
    let newAppartment = new Apartment(req.body);
    newAppartment.save((err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect(grant_access('/'));
        }
    });
})

router.get('/me',(req,res)=>{
    res.render(grant_access('userpage'));
});

router.get('/myApartments',(req,res)=>{
    Apartment.find({owner:userInfo.email},(err,apartments)=>{
        if(err){
             console.log(err);
        }
        else{
            res.render(grant_access('myApartments'),{
              apartments: apartments
           })
        }
    })
});

router.get('/myApartments/edit/:id',(req,res)=>{
    res.sendFile(grant_access('/media/nyquist/Scay_Tery/dev/web/node_js/apart/16/views/edit.html'))
  })

module.exports = router;
