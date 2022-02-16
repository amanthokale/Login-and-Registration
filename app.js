require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
require('./db/con')
const hbs = require('hbs');
const Register = require('./db/schema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

console.log(process.env.JWT_SECRET)
const port = process.env.PORT || 3000;


const s_path = path.join(__dirname,"./static")
console.log(s_path)

app.set("view engine","hbs")
app.set("views",path.join(__dirname,"./templates/views"))
app.use(express.json());
app.use(express.urlencoded({extended:false}))
// app.use(express.static(s_path));

hbs.registerPartials(path.join(__dirname,"./templates/partials"))


app.get('/',(req,res)=>{
  res.render("login")
})
app.get('/login',(req,res)=>{
  res.render("login")
})
app.get('/reg',(req,res)=>{
  res.render("reg")
})

app.post('/login',async(req,res)=>{
  try {
   const username = req.body.username;
   const password = req.body.password;
   const a = await Register.findOne({username:username});
   const verify = await bcrypt.compare(password,a.password);

   const token = await a.generateAuth();
   console.log(`hui hui hui hui ${token}`)

   console.log(verify);
   if(verify){
      res.send("Logged in successfully");
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
