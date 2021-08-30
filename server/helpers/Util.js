const moment = require('moment');
const Auth= require('../models/Auth');

//token Verification
module.exports = (req, res, next)=> {
 Auth.findOne({ accountId: req.body.accountId }, function (err, data) {
  if (data) { 
    if(data.token==req.body.token){
      if(moment().isBefore(data.validTill)){
        next() 
      }
      else{
        res.send("tokenInvalid")
      }
    }else{res.send("tokenInvalid")}
  }
})
}