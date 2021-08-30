const { response } = require('express')
const express = require('express');
const router = express.Router()
const Auth = require('../models/Auth')
const Transaction = require('../models/Transaction')
const { uuid } = require('uuidv4');
const axios = require('axios')
const moment = require('moment');
const validatetoken =require('../helpers/Util')

router.use(validatetoken)

router.get('/', function (req, res) {
    res.send("Server for Nithish Banking Chat-Bot is Running successfully");
});


router.post('/getName', function (req, res) {
    Auth.findOne({ accountId: req.body.accountId }, function (err, data) {
        if (data) { res.send(data.name) }
    })
})

router.post('/getBalance', function (req, res) {
    Auth.findOne({ accountId: req.body.accountId }, function (err, data) {
        var bal = data.balance
        res.send(`${bal}`)
    })
})
router.post('/getStatementsDebits', function (req, res) {
    Transaction.find({ fromAccount: req.body.accountId }, function (err, data) {
       res.send(data)
    }).limit(5).sort({$natural:-1})
})
router.post('/getStatementsCredits', function (req, res) {
    Transaction.find({ toAccount: req.body.accountId }, function (err, data) {
       res.send(data)
    }).limit(5).sort({$natural:-1})
})

router.post('/fundTransfer', (req, res) => {
    if (req.body.accountId === req.body.partnerId) {
        res.send({ msg: "account Id and Partner Id can't be same" })
    }
    else {
        Auth.findOne({ accountId: req.body.accountId }, function (err, data) {
            if (data.ftpin === req.body.ftpin) {
                var limit = data.balance - Number(req.body.amount)
                if (limit > -1) {
                    Auth.findOne({ accountId: req.body.partnerId }, function (err, data) {
                        if (data) {
                            var current = data.balance + Number(req.body.amount)
                            Auth.findOneAndUpdate({ accountId: req.body.accountId }, { balance: limit }, function (err, data) { })
                            Auth.findOneAndUpdate({ accountId: req.body.partnerId }, { balance: current }, function (err, data) { })
                            res.send({ msg: "Successful", balance: limit })
                                const transaction = new Transaction({
                                    transactionId: req.body.transactionId,
                                    fromAccount: req.body.accountId,
                                    toAccount: req.body.partnerId,
                                    amount:req.body.amount,
                                    time:moment()
                                })
                                transaction.save()
                                    .then(data => {
                                        res.send(data)
                                    }).catch(err => {
                                        if (err) {
                                            console.log(err)
                                        }
                                    })
                           
                        } else {
                            res.send({ msg: "Partner Id Not Found" })
                        }
                    })

                }
                else {
                    res.send({ msg: "In Sufficient" })
                }
            } else {
                res.send({ msg: "Wrong FTpin" })
            }
        })
    }
})

module.exports = router