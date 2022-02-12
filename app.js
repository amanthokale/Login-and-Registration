const express = require('express');
const app = express();
const path = require('path');
require('./db/con')
const hbs = require('hbs');
const Register = require('./db/schema');
const User = require('./db/schema');



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
   console.log(a)
   if(a.password===password){
      res.render("index")
   }
   else{
     res.send("Invalid creadentials")
   }
  } catch (e) {
      console.log("Error")
  }
})
app.post('/reg',(req,res)=>{
  try {
    const p = req.body.password;
    const cp = req.body.confirmpassword;
    if(p===cp){
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
        r.save().then(()=>{
          console.log("Data")
        })
        res.render("index")
    }
    else{
      res.send("passwords are not matching")
    }
  } catch (e) {
      res.status(400).send(e)
  }
})


app.listen(port,()=>{
    console.log(`Listening at port ${port}`)
})
