const mongoose = require('mongoose')
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(()=> {
    console.log('Database connected');
  })
  .catch((error)=> {
    console.log('Connecting to database error');
  });
