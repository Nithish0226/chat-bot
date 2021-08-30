const { response } = require('express')
const express = require('express');
const router = express.Router()
const Auth = require('../models/Auth')
const Transaction = require('../models/Transaction')
const { uuid } = require('uuidv4');
const axios = require('axios')
const moment = require('moment');


router.get('/', function (req, res) {
    res.send("Server for Nithish Banking Chat-Bot is Running successfully");
});

router.post('/signUp', (req, res) => {
    const auth = new Auth({
        name: req.body.name,
        phoneNo: req.body.phoneNo,
        emailId: req.body.emailId,
        password: req.body.password,
        ftpin: req.body.ftpin,
        accountId: uuid(),
        balance: 0
    })
    auth.save()
        .then(data => {
            res.send(data)
        }).catch(err => {
            if (err) {
                res.send("Already Exist")
            }
        })

})

router.post('/signIn', function (req, res) {
var token1=uuid();
    Auth.findOneAndUpdate({ accountId: req.body.accountId },{token:token1,validTill: `${moment().add(15, 'minutes')}` }, function (err, data) {
        if (data) {
            if (data.password === req.body.password) {
                localdata = {
                    accountId: data.accountId,
                    name: data.name,
                    token: token1
                }
                res.send(localdata)
            } else { res.send("Unauthorized") }
        }
        else { res.send("Unauthorized") }
    })
})

router.post('/nlp', function (request, response) {
    axios.post('http://127.0.0.1:5000/post', {
        question: request.body.content
    })
        .then(res => {
            var a = res.data.answer
            response.send(a)
        })
        .catch(error => {
        })

})



router.post('/getTransaction', function (req, res) {
        res.send("")
})


module.exports = router