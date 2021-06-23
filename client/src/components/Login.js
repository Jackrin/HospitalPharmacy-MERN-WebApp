import { useEffect, useState, Fragment } from 'react';
import axios from 'axios'
import { Container, Grid, Paper, Avatar, TextField, Button, Typography, Link, Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import { useStyles } from './style/Login-styling'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props}  />;
}

export default function Login(props) {

  const theme = props.theme
  const history = props.history
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("error");
  const classes = useStyles(theme);

  async function session() {
    await axios({
      method: 'GET',
      url: '/api/csrf',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: 'cors'
    })
    .then(function(res) {
      localStorage.setItem('csrfToken', res.data.csrfToken)
    })

    axios({
      method: 'POST',
      url: '/api/session',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'X-CSRF-Token': localStorage.getItem('csrfToken')
      },
      credentials: "include",
      mode: 'cors'
    })
    .then(function(res) {
      if(res.data.result == "Logged"){
        switch(res.data.job){
          case "doctor":
            history.replace("/dashboard1")
            break;
          case "pharmacist":
            history.replace("/dashboard2")
        }
      }
      else if (res.data.result == "Not logged"){
      }
    })
    .catch(function(err){
      if (err) {
        setAlert("Session error!")
        setSeverity("error")
        setOpen(true);
      }
    })
  }

  useEffect(() => {
    session();
  }, [])

  const passwordEnter = e => {
    if (e.code == "Enter") {
      login()
    }
  }; 
  const nameEnter = e => {
    if (e.code == "Enter") {
      document.getElementsByName('password')[0].focus()
    }
  }; 

  async function login() {
    axios({
      method: 'POST',
      url: '/api/login',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'X-CSRF-Token': localStorage.getItem('csrfToken')
      },
      data: {
        name: name,
        password: password
      },
      credentials: "include",
      mode: 'cors'
    })
    .then(function(res) {
      if(res.data.result == "Login successful"){
        switch(res.data.job){
          case "doctor":
            history.replace("/dashboard1")
            break;
          case "pharmacist":
            history.replace("/dashboard2")
            break;
        }
      }
      else if (res.data.result == "Invalid credentials"){
        setAlert("Wrong credentials!")
        setSeverity("error")
        setOpen(true);
      }
    })
    .catch(function(err){
      if (err) {
        setAlert("Invalid CSRF Token! Please refresh the page")
        setSeverity("error")
        setOpen(true);
      }
    })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return(
    <Fragment>
      <Container className={classes.container} component="main" maxWidth="xs">
        <div className={classes.paper}>
        <Typography variant="h3" className={classes.title}>Login</Typography>
          <div className={classes.form}>
            <TextField 
              color="secondary" margin="normal" fullWidth variant="filled" 
              label="Name" onKeyPress={(e) => nameEnter(e)} autoFocus={true} 
              autoComplete="off" spellCheck="false" type="text" name="name" 
              id="name" value={name} onChange={(e) => setName(e.target.value)}
            /> 
            <TextField
              color="secondary" margin="normal" fullWidth variant="filled" 
              label="Password" onKeyPress={(e) => passwordEnter(e)} type="password" 
              name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        <Button variant="contained" className={classes.button} onClick={login}>Login</Button>
        </div>
      </Container>
      <Snackbar open={open} autoHideDuration={4000} 
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity}>
          {alert}
        </Alert>
      </Snackbar>
    </Fragment>
  )
}