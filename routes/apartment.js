const express = require('express');
//const app = express();
const router = express.Router();
const models = require('../models');
const Apartment = models.Apartment;
//const path = require('path');

router.get('/:id',(req,res)=>{
  Apartment.findById(req.params.id,(err,apartment)=>{
    res.render('apartment',apartment);
  })
})

module.exports = router;
