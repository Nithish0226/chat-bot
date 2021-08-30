const mongooes = require ('mongoose')


const Transaction = new mongooes.Schema({
transactionId:{
  type:String,
},
time:{
type:String,
},
fromAccount:{
  type:String,
},
toAccount:{
  type:String,
},
amount:{
  type:String,
},
})
module.exports = mongooes.model('Transaction',Transaction)