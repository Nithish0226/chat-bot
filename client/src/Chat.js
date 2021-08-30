import React from 'react';
import './App.css';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

var transD=[]
var transC=[]
const useStyles = makeStyles((theme) => ({
    table:{
        width:700,
    },
    paper1: {
        marginTop: 10,
        marginLeft: 50,
        borderRadius: 25,
        paddingLeft: 20,
        paddingBlock: 5,
        width: 750
    },
    paper2: {
        marginTop: 10,
        marginLeft: 500,
        borderRadius: 25,
        paddingLeft: 20,
        paddingBlock: 5,
        width: 750
    }
}))
export default function Chat({ post }) {
    const [title, settitle] = React.useState([]);
    const [content, setcontent] = React.useState([]);
    const [style, setstyle] = React.useState([]);
    React.useEffect(() => {
        if (post.title === "Nithish Bank") {
            settitle(post.title)
            setcontent(post.content)
            setstyle(classes.paper1)
        }
        else if (post.title === "trasaction") {
            settitle(post.title)
            setcontent(post.content)
            setstyle(classes.paper1)
            var str = window.name
            var auth = str.split(" ");
            var accountId = auth[0]
            var token = auth[1]
            var id = {
                accountId: accountId,
                token: token
            }
            axios.post('http://localhost:2602/transaction/getStatementsDebits', id).then(res => {
                if (res.data === "tokenInvalid") {
                    alert("Token Invllid are Time Out")
                    window.location.href = "/";
                }
                else {
                     transD = res.data
                }
            })
            axios.post('http://localhost:2602/transaction/getStatementsCredits', id).then(res => {
                if (res.data === "tokenInvalid") {
                    alert("Token Invllid are Time Out")
                    window.location.href = "/";
                }
                else {
                     transC = res.data
                }
            })
        }
        else {
            settitle(post.title)
            setcontent(post.content)
            setstyle(classes.paper2)
        }
    }, [])
    const classes = useStyles();
    if (post.title === "trasaction") {
        return (
            <div>
                <Paper className={style} elevation={200}>
                    Debit
                    <TableContainer component={Paper} className={classes.table}>
                        <Table  aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>To Account </TableCell>
                                    <TableCell >Amount</TableCell>
                                    <TableCell >Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {transD.map((row) => (
                                <TableRow>
                                <TableCell>{row.toAccount} </TableCell>
                                <TableCell >{row.amount}</TableCell>
                                <TableCell >{row.time}</TableCell>
                            </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    Credit
                    <TableContainer component={Paper} className={classes.table}>
                        <Table  aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>From Account </TableCell>
                                    <TableCell >Amount</TableCell>
                                    <TableCell >Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {transC.map((row) => (
                                <TableRow>
                                <TableCell>{row.fromAccount} </TableCell>
                                <TableCell >{row.amount}</TableCell>
                                <TableCell >{row.time}</TableCell>
                            </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
        )
    }
    else {
        return (
            <div>
                <Paper className={style} variant="outlined" elevation={200}>
                    {title} : <br />
                    {content}
                </Paper>
            </div>
        )
    }
}