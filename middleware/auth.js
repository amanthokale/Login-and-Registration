const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Register = require('../db/schema');
const alert = require('alert');





const auth = async(req,res,next)=>{
  try {
    const token = req.cookies.jwt;
    const verify =await jwt.verify(token,process.env.JWT_SECRET);

    const user = await Register.findOne({_id:verify._id});
    next();
  } catch (e) {
    console.log("CANNOT AUTHORIZE YOU")
    res.render("login")
    alert("You Need To Login First")
  }

}


module.exports = auth;
