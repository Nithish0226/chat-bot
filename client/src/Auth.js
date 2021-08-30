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
    paddingLeft:260,
    backgroundColor:'#128C7E',
    paddingBottom:20,
    color:'white'
  },
  header:{
    paddingTop:20,
    paddingLeft:580,
    paddingBottom:20,
    backgroundColor:'#128C7E',
    color:'white'

  },
  input: {
    color: 'white'
  }
}))
var signupbody = {}
var signinbody={}
var tid = ""
var st=""
var flow = true
function post(tid1, title1, content1) {
  var postl = {
    transactionId: tid1,
    title: title1,
    content: content1
  }
  postlocal.push(postl)
}
function signup1(signupbody1) {
  axios.post('http://localhost:2602/signUp', signupbody1).then(res => {
    post(tid, "Nithish Bank", "SignUp Successful")
    post(tid, "Nithish Bank", `Your Account Id : ${res.data.accountId}`)
    post(tid, "Nithish Bank", "Enter your Accound Id to signIn")
  })
}
function signin2(signinbody1) {
  axios.post('http://localhost:2602/signIn', signinbody1).then(res => {
   if(res.data==="Unauthorized"){
    post(tid, "Nithish Bank","Incorrect Password or Account Id")
    post(tid, "Nithish Bank","Enter your Account Id to SignIn or Enter newUser to SignUp")
    flow=true
    return("flase")
   }
   else{
     window.name=`${res.data.accountId} ${res.data.token}`;
     window.location.href="/home";
     return("true")
   }
  })
}
function validate(content1,signin1) {
  if(signin1==="accountId")
  {
    signinbody.accountId=content1;
    post(tid, "you",signinbody.accountId)
    post(tid, "Nithish Bank","Enter your password")
    return("password")
  }
  if(signin1==="password"){
    signinbody.password=content1;
    post(tid, "you",signinbody.password) 
    return(signin2(signinbody))
  }
}
function newuser() {
  post(tid, "you", "newUser")
  post(tid, "Nithish Bank", "Enter your name")
  return ("name")
}
function signupfun(signupfield, content) {
  if (signupfield === "name") {

    signupbody.name = content;
    post(tid, "you", signupbody.name)
    post(tid, "Nithish Bank", "Enter your Phone No")
    return ("phoneNo")
  }
  if (signupfield === "phoneNo") {
    signupbody.phoneNo = content;
    post(tid, "you", signupbody.phoneNo)
    post(tid, "Nithish Bank", "Enter your Email Id")
    return ("emailId")
  }
  if (signupfield === "emailId") {
    signupbody.emailId = content;
    post(tid, "you", signupbody.emailId)
    post(tid, "Nithish Bank", "Enter your password")
    return ("password")
  }
  if (signupfield === "password") {
    signupbody.password = content;
    post(tid, "you", signupbody.password)
    post(tid, "Nithish Bank", "Enter your 4 digit Fund Transfer Pin")
    return ("ftpin")
  }
  if (signupfield === "ftpin") {
    signupbody.ftpin = content;
    post(tid, "you", signupbody.ftpin)
    signup1(signupbody)
    return ("end")
  }
}

function App() {
  const classes = useStyles();
  const [transactions, settransactions] = React.useState([]);
  const [signup, setsignup] = React.useState(false);
  const [signin, setsignin] = React.useState("accountId");
  const [signin4, setsignin4] = React.useState(false);
  const [signupfield, setsignupfield] = React.useState("");
  const [content, setcontent] = React.useState([]);
  const [val,setval]=React.useState([]);
  React.useEffect(() => {
    tid = uuid();
    post(tid, "Nithish Bank", "Welcome to Banking Chat-Bot. Enter your Account Id for sign In or Enter newUser for sign Up.");
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
    if (signup) {
      setsignupfield(signupfun(signupfield, content));
      if (signupfield === "end") {
        setsignup(false)
        flow = true
      }
    }
    if (flow) {
      if (st === "newUser") {
        flow = false
        setsignup(true)
        setsignupfield(newuser());
       
      }
    } if (flow) {        
        setsignin(validate(content,"accountId"))
        setsignin4(true)
        flow=false
    }
    if(signin4){
      setsignin(validate(content,signin))
  }
}
console.log(transactions)
  return (
    <div className>
      <div className={classes.header}><b>Nithish Banking Chat-Bot </b></div>
      <div className={classes.body}>
        <Box style={{ height: 450, overflow: 'auto' }}>
        {postlocal.map((postlocal) => (
            <Chat post={postlocal} />
          ))} 
        </Box>
      </div>
      <div className={classes.inp}>
        <TextField label=" ㅤChat"  value={val} onChange={setval1} className={classes.root}
        />
        <Button onClick={onclick} className={classes.button}>
          <SendIcon />
        </Button>
      </div>
    </div>
  );
}

export default App;
