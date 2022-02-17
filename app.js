require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
require('./db/con')
const hbs = require('hbs');
const Register = require('./db/schema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
const alert = require('alert');


console.log(process.env.JWT_SECRET)
const port = process.env.PORT || 3000;


const s_path = path.join(__dirname,"./static")
console.log(s_path)

app.set("view engine","hbs")
app.set("views",path.join(__dirname,"./templates/views"))
app.use(express.json());
app.use(express.urlencoded({extended:false}))
// app.use(express.static(s_path));
app.use(cookieParser());



hbs.registerPartials(path.join(__dirname,"./templates/partials"))


app.get('/',(req,res)=>{
  res.render("index")
})
app.get('/login',(req,res)=>{
  res.render("login")
})
app.get('/reg',(req,res)=>{
  res.render("reg")
})
app.get('/private',auth,(req,res)=>{
  console.log(`cookieeeeeeeeeeee ${req.cookies.jwt}`)
  res.render("private")
})

app.get('/logout',auth,async(req,res)=>{
  try {
    res.clearCookie('jwt');
    // res.send("LOGOUT SUCCESSFULL")

    //
    req.user.tokens = req.user.tokens.filter((element)=>{
        return element.token !== req.token;
    })
    console.log(req.user.tokens)
    await req.user.save();
    //
    res.redirect('/login')
    // res.render("login")
    alert("Logout Successful")
  } catch (e) {
    res.status(500).send(e)
  }
})

app.post('/login',async(req,res)=>{
  try {
   const username = req.body.username;
   const password = req.body.password;
   const a = await Register.findOne({username:username});
   const verify = await bcrypt.compare(password,a.password);

   const token = await a.generateAuth();
   console.log(`hui hui hui hui ${token}`)


res.cookie('jwt',token,{
  //expires:new Date(Date.now()+300000),
  httpOnly:true,
  secure:true
})

console.log(`cookieeeeeeeeeeee ${req.cookies.jwt}`)
   console.log(verify);
   if(verify){
      res.render("index");
   }
   else{
     res.send("Invalid creadentials")
   }
  } catch (e) {
      console.log(e)
      res.status(400).send("Cannot log in due to internal server error")
  }
})
app.post('/reg',async (req,res)=>{
  try {
    const p = req.body.password;
    const cp = req.body.confirmpassword;
    if(p===cp){
        const pass = await bcrypt.hash(req.body.password,10);
        console.log(pass)
        const r = new Register({
          firstName:req.body.firstName,
          lastName:req.body.lastName,
          age:req.body.age,
          gender:req.body.gender,
          username:req.body.username,
          mobile:req.body.mobile,
          password:req.body.password,
          course:req.body.course
        });
          const token = await r.generateAuth();
          console.log(`hui hui hui hui ${token}`)

          res.cookie('jwt',token)

        r.save().then(()=>{
          console.log(r)
        })
        res.render("login")
    }
    else{
      res.send("passwords are not matching")
    }
  } catch (e) {
      res.status(400).send("cannot register user");
  }
})



// const create=async()=>{
//     const j=await jwt.sign({_id:"620ce835b95c50d4ee1fa118"},"amanthokale",{
//       expiresIn:"2 seconds"
//     })
//     console.log(`this is ${j} huiiiiiiiiiiiiiiiiiiii \n`)
//
//     const v = await jwt.verify(j,"amanthokale")
//     console.log(v)
// }







app.listen(port,()=>{
    console.log(`Listening at port ${port}`)
})
