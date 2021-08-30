const express = require('express')
const app =express()
const mongoose =require('mongoose')
const auth = require('./routes/auth')
const transaction =require('./routes/transaction')
const cors = require('cors')


mongoose.connect('mongodb+srv://nithishkumar04:nithinithi@cluster0.lvkt2.mongodb.net/chat-bot?retryWrites=true&w=majority',{
useNewUrlParser:true,
useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log('mongo is connected.');
  })
 
  
  app.use(express.json())
  app.use(cors())
  app.use('/', auth)
  app.use('/transaction',transaction)
  let port=2602
  app.listen(port, ()=> console.log(`server up and is running on port ${port}`))