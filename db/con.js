const mongoose = require('mongoose');


mongoose.connect("mongodb://localhost:27017/registration").then(()=>{
  console.log("Connected to DB");
}).catch(()=>{
  console.log("DB connection failed")
})
