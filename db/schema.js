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

const userSchema= new mongoose.Schema({
  username:{
    type:String,
    unique:true,
    required:true
  },
  password:{
    type:String,
    required:true
  }
})


const User = new mongoose.model("User",userSchema);
const Register = new mongoose.model("Register",regSchema);


module.exports = User;
module.exports = Register;
