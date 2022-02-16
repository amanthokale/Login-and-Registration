const mongoose= require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  },
  mobile:{
    type:Number
  },
  password:{
    type:String
  },
  course:{
    type:String
  },
  tokens:[{
      token:{
        type:String,
        required:true
      }
  }]

})



regSchema.methods.generateAuth = async function(){
  try {
      const jwtToken = await jwt.sign({id:this._id},process.env.JWT_SECRET)
      console.log(jwtToken);
      this.tokens = this.tokens.concat({token:jwtToken})
      await this.save();
      return jwtToken;
  } catch (e) {
      console.log(`JWT Authentication Error ${e}`)
  }
}

regSchema.pre("save",async function(next){
  if(this.isModified("password")){
    const phash = await bcrypt.hash(this.password,10);
    this.password=phash;
  }
    next();
})


const Register = new mongoose.model("Register",regSchema);



module.exports = Register;
