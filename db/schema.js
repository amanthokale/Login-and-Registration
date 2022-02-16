const mongoose= require('mongoose');


const regSchema=new mongoose.Schema({
  firstName:{
    type:String
  },
  lastName:{
    type:String
  },
  age:{
    type:Number
  },
  gender:{
    type:String
  },
  username:{
    type:String,
    unique:true
  },
  mobile:{
    type:Number
  },
  password:{
    type:String
  },
  course:{
    type:String
  }

})





const Register = new mongoose.model("Register",regSchema);



module.exports = Register;
