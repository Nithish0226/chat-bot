const mongooes = require ('mongoose')

const Auth = new mongooes.Schema({
    name:{ 
        type: String,
      requited: true,
      },
      phoneNo:{ 
        type: String, 
        unique: true, 
      requited: true,
      },
      emailId:{ 
        type: String,
        unique: true,
      requited: true,
      },
      accountId:{ 
        type: String,
      requited: true,
      },
      password:{ 
        type: String,
      requited: true,
      },
      token:{
        type: String,
        requited: true,
      },
      validTill:{
        type: String,
        requited: true,
      },
      balance:{ 
        type: Number,
        requited: true, 
      },
      ftpin:{ 
        type: String,
        requited: true, 
      },
})

module.exports = mongooes.model('Auth',Auth)
