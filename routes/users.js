const express = require('express');
const router = express.Router();
const app = express();
const {createSalt,createHash} = require('../custom_modules/hasher.js');
const {User,Apartment} = require('../models');
const mkdirp = require('mkdirp');
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
            mkdirp(path.join(uploadPath,req.body.email),(err)=>{
              if(err) console.log(err);
            });
            mkdirp(path.join(uploadPath,req.body.email,"js"),(err)=>{
              if(err) console.log(err);
            });
            fs.writeFile("/media/nyquist/Scay_Tery/dev/web/node_js/apart/16/public/users/"+ req.body.email + "/js/apartment.js","",(err)=>{
              if(err){
                throw err;
              }
            })
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
    res.sendFile('/media/nyquist/Scay_Tery/dev/web/node_js/apart/16/views/newEntry.html');
  }else{
    res.render('accessDenied');
  }
});

router.post('/newEntry',(req,res)=>{
  if(userAccess){
    const fileNames = ["livingroom.jpg","diningroom.jpg","bedroom.jpg","livingroom2.jpg"];
    userInfo.numberOfApartments++;
    let picPath = path.join(uploadPath,userInfo.email,"photos");
    let currentPath = path.join(picPath,userInfo.numberOfApartments.toString());

    mkdirp(picPath,(err)=>{
      if(err) console.log(err);
    });
    mkdirp(currentPath,(err)=>{
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
      files.mv(path.join(currentPath,fileNames[idx]),(err)=>{
          if(err)console.log(err);
      });
    });

    res.redirect('/users/me');
  }
 if(!userAccess){
  res.render('accessDenied');
  }
})

router.get('/me',(req,res)=>{
  if(userAccess){
    res.render('userpage');
  }else{
    res.render('accessDenied')
  }

});

router.get('/myApartments',(req,res)=>{
  if(userAccess){
    Apartment.find({owner:userInfo.email},(err,apartments)=>{
      if(err)
        console.log(err);
      else
        res.render('myApartments',{
          apartments: apartments
        });
    })
  }else{
    res.render('accessDenied')
  }
});

router.get('/myApartments/edit/:id',(req,res)=>{
  Apartment.findById(req.params.id,(err,apartment)=>{

    fs.writeFile("/media/nyquist/Scay_Tery/dev/web/node_js/apart/16/public/js/apartment.js",
    `const Apartment = {
      address:"${apartment.address}",
    	checkIn : "${apartment.checkIn}",
    	checkOut : "${apartment.checkOut}",
    	maxPeople : ${apartment.maxPeople},
    	bathrooms : ${apartment.bathrooms},
    	bedrooms : ${apartment.bedrooms},
    	country : "${apartment.country}",
    	state : "${apartment.state}",
    	zip : ${apartment.zip},
    	Accessibilty : "${apartment.Accessibilty}",
    	WiFi : "${apartment.WiFi}",
    	Shower : "${apartment.Shower}",
    	Kitchen : "${apartment.Kitchen}",
    	Heating : "${apartment.Heating}",
    	Tv : "${apartment.Tv}",
    	owner : "${apartment.owner}",
    	apartmentNumber : ${apartment.apartmentNumber}
    }
    `,(err)=>{
      if(err){
        throw err
      }
    }
  );
  })
  res.sendFile('/media/nyquist/Scay_Tery/dev/web/node_js/apart/16/views/edit.html')
})

module.exports = router;
