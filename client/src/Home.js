import './App.css';
import React from 'react';
import axios from "axios";
import Chat from './Chat';
import Box from '@material-ui/core/Box';
import { uuid } from 'uuidv4';
import { TextField } from '@material-ui/core';
import Button from "@material-ui/core/Button";
import SendIcon from '@material-ui/icons/Send';
import { makeStyles } from "@material-ui/core/styles";


var postlocal=[]
const useStyles = makeStyles((theme) => ({
  button: {
    paddingTop: 15,
    paddingLeft: 5
  },
  root:{
    width:800,
    backgroundColor: 'rgb(250,250,250)'  },
  body:{
    paddingLeft:5,
    backgroundColor:'#6fde9d',
    color:'#f2da61'
  },
  inp:{
    paddingTop:30,
    paddingLeft:200,
    backgroundColor:'#128C7E',
    paddingBottom:20,
    color:'white'
  },
  header:{
    paddingTop:20,
    paddingLeft:500,
    paddingBottom:20,
    backgroundColor:'#128C7E',
    color:'white'

  },
  input: {
    color: 'white'
  }
}))
var fundtransferbody={}
var tid = ""
var str=window.name
var auth=str.split(" ");
var accountId=auth[0]
var token=auth[1]
var name=""
var st=""
var flow=true
function fundtransfer1(){
  axios.post('http://localhost:2602/transaction/fundTransfer', fundtransferbody).then(res => {
    if(res.data==="tokenInvalid"){
      alert("Token Invllid are Time Out")
      window.location.href="/";
    }
    else{
    if(res.data.msg==="Successful"){
      post(tid, "Nithish Bank", "Fund transfer Successfull")
      post(tid, "Nithish Bank", `Your Current Balance : ${res.data.balance}`)
    }
    if(res.data.msg==="Partner Id Not Found"){
      post(tid, "Nithish Bank", "Payee Id Not Found")
    }
    if(res.data.msg==="In Sufficient"){
      post(tid, "Nithish Bank", "Insufficient Balance")
    }
    if(res.data.msg==="Wrong FTpin"){
      post(tid, "Nithish Bank", "Wrong Ftpin")
    }
    if(res.data.msg==="account Id and Partner Id can't be same"){
      post(tid, "Nithish Bank", "account Id and Payee Id can't be same") 
    }
  }
})
}
function post(tid1, title1, content1) {
  var postl = {
    transactionId: tid1,
    title: title1,
    content: content1
  }
  postlocal.push(postl)
}
function fundtransfer(FundTransferState1,content1){
  if(FundTransferState1==="partnerId"){
    post(tid, name, content1)
    post(tid, "Nithish Bank", "Enter payee's account number")
    return("account")
  }
  if(FundTransferState1==="account"){
    fundtransferbody.accountId=accountId;
    fundtransferbody.partnerId=content1;
    post(tid, name, content1)
    post(tid, "Nithish Bank", "Enter the Amount need to Transfer")
    return("amount")
  }
  if(FundTransferState1==="amount"){
    fundtransferbody.amount=content1;
    post(tid, name, content1)
    post(tid, "Nithish Bank", "Enter the FTpin")
    return("ftip")
  }
  if(FundTransferState1==="ftip"){
    fundtransferbody.ftpin=content1;
    fundtransferbody.token=token;
    fundtransfer1();
    post(tid, name, content1)
    flow=true
    return("end")
  }
}
function App() {
  const classes = useStyles();
  const [transactions, settransactions] = React.useState([]);
  const [content, setcontent] = React.useState([]);
  const [FundTransferState,setFundTransferState]=React.useState("partnerId");
  const[fund,setfund]=React.useState(false);
  const [val,setval]=React.useState([]);
  React.useEffect(() => {
    tid=uuid()
    var id={
      accountId:accountId,
      token:token
    }
    axios.post('http://localhost:2602/transaction/getName', id).then(res => {
if(res.data==="tokenInvalid"){
  alert("Token Invllid are Time Out")
  window.location.href="/";
}
else{
      post(tid, "Nithish Bank", `Welcome ${res.data}`)
      name=res.data;
      post(tid, "Nithish Bank", "Enter Balance to know your account balance.")
    post(tid, "Nithish Bank", "Enter FundTransfer for Fund Transfer.")
    post(tid, "Nithish Bank", "Enter Statement  for last 5 transactions .")
}
    })
  }, [])
  React.useEffect(() => {
    
    var id = {
      transactionId: tid
    } 
    axios.post('http://localhost:2602/getTransaction', id).then(res => {
      settransactions(res.data)
    })
    settransactions(postlocal)
  })
  function setval1(e){
    setcontent(e.target.value)
    setval(e.target.value)
  }
  function onclick(){
    axios.post('http://localhost:2602/nlp', {content : content}).then(res => {
    if(res.data===""){
      onclick1()
      st=""
    }
    else{
      st=(res.data)
      onclick1()
    }
    })
    }
      function onclick1() {
    setval("")
    if(flow){
  if(st==="Balance"){
    post(tid,name,content)
    var id={
      accountId:accountId,
      token:token
    }
    axios.post('http://localhost:2602/transaction/getBalance', id).then(res => {
      if(res.data==="tokenInvalid"){
        alert("Token Invllid are Time Out")
        window.location.href="/";
      }
      else{
      post(tid, "Nithish Bank", `Balance : $ ${res.data}`)
      }
  })
  }
  if(st==="transaction"){
    post(tid,name,content)
    post(tid, "trasaction", `${accountId} ${token}`)
  }
if(st==="FundTransfer"){
setfund(true)
if(FundTransferState==="end"){post(tid, "Nithish Bank", `Restart to FundTransfer`)}
else{
setFundTransferState(fundtransfer("partnerId",content))}
flow=false
}}
if(fund){
  setFundTransferState(fundtransfer(FundTransferState,content))
}
  }

  return (
    <div className>
      <div className={classes.header}><b>Nithish Banking Chat-Bot </b></div>
      <div className={classes.body}>
        <Box style={{ height: 450, overflow: 'auto'}}>
        {postlocal.map((transaction) => (
            <Chat post={transaction} />
          ))}
        </Box>
      </div>
      <div className={classes.inp}>
        <TextField label="ㅤ Chat"  value={val} onChange={setval1} className={classes.root}
        />
        <Button onClick={onclick} className={classes.button}>
          <SendIcon />
        </Button>
      </div>
    </div>
  );
}
//value={val} onChange={setval1}
export default App;
