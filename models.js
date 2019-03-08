const mongoose = require('mongoose');
let mod = {};

const userSchema = mongoose.Schema({
  firstName:{
    type: String,
    require: true
  },
  lastName:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  numberOfApartments:{
    type:Number
  }
});

const apartmentSchema = mongoose.Schema({
     address:{
        type:String
     },
     checkIn:{
         type:String
     },
     checkOut: {
         type:String
     },
     maxPeople:{
        type:Number
     },
     bathrooms:{
         type:Number
     },
     bedrooms:{
        type:Number
     },
     country: {
         type:String
     },
     state:{
        type:String
     },
     zip:{
         type:String
     },
     WiFi:{
        type:String
     },
     Tv:{
        type:String
     },
     Shower:{
        type:String
     },
     Kitchen:{
        type:String
     },
     Heating:{
         type:String
     },
     Accessibilty:{
         type:String
     },
     owner:{
         type:String
     },
     apartmentNumber:{
       type:Number
     }
});

const myApartmentsSchema = mongoose.Schema({
  test:{
    type:String
  }
})

mod.User = mongoose.model('Users',userSchema);
mod.Apartment = mongoose.model('apartments',apartmentSchema);
mod.MyApartments = mongoose.model('myApartments',myApartmentsSchema);

module.exports = mod;
