const express = require('express');
const app = express();
const router = express.Router();
const {Apartment,User} = require('../models');
// const path = require('path');

router.get('/',(req,res)=>{
  Apartment.find({},(err,apartments)=>{
  if(err)
    console.log(err);
  else
    res.render('shop',{
      apartments: apartments
    });
  });
});

router.post('/',(req,res)=>{
  Apartment.find({zip:req.body.zip},(err,apartments)=>{
  if(err)
    console.log(err);
  else
    res.render('shop',{
      apartments: apartments
    });
  });
});

module.exports = router;
