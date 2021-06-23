import { useEffect, useState, Fragment } from 'react';
import axios from 'axios'
import { InterfaceStyle, Accordion, AccordionSummary, Skeleton } from './style/Dashboard2-styling'
import { CssBaseline, List, ListItem, ListItemText, ListItemIcon, 
          Divider, Container, Grid, Paper, Avatar, TextField, Button, 
          Typography, Link, Snackbar, AppBar, Toolbar, InputBase, IconButton, 
          Drawer, Card, CardContent, CardActions, CardHeader, Collapse,
          AccordionDetails, AccordionActions, Menu, MenuItem, Checkbox } from '@material-ui/core'
import { Alert as MuiAlert } from '@material-ui/lab';
import { Menu as MenuIcon, Search as SearchIcon, Mail as MailIcon, Inbox as InboxIcon, 
          Brightness7 as BrightnessIcon, Brightness2 as NightIcon, ExpandMore as ExpandMoreIcon, 
          Check as CheckIcon, WbSunny as SunIcon, NavigateBefore as NavigateBeforeIcon, NavigateNext as NavigateNextIcon,
          Sort as SortIcon, ExitToApp as LogoutIcon, Assignment as AssignmentIcon, AssignmentTurnedIn as AssignmentTurnedInIcon,
          Restore as RestoreIcon} from '@material-ui/icons';
import clsx from 'clsx';
import { Scrollbars } from 'react-custom-scrollbars-2';

export default function Dashboard2(props) {
  const theme = props.theme
  const toggleTheme = props.toggleTheme
  const history = props.history
  const classes = InterfaceStyle(theme);
  const [openAlert, setOpenAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openMenu, setOpenMenu] = useState(true);
  const [isLoaded, setLoaded ] = useState(false)
  const [presc, setPresc] = useState([])
  const [search, setSearch] = useState("")
  const [reportState, setReportState] = useState("unreviewed")
  const [listItemSelected, setListItemSelected] = useState(1)
  const [disableBeforeButton, setDisableBeforeButton] = useState(true)
  const [disableNextButton, setDisableNextButton] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortParams, setSortParams] = useState()

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props}  />;
  }

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  async function prescriptions(direction, search, state, sortParams) {
    setLoaded(false)
    axios({
      method: 'POST',
      url: '/api/prescriptions',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'X-CSRF-Token': localStorage.getItem('csrfToken')
      },
      data: {
        direction: direction,
        search: search,
        state: state,
        sortParams: sortParams
      },
      credentials: "include",
      mode: 'cors'
    })
    .then(function(res) {
      setPresc(res.data)
      setLoaded(true)
    })
    .catch(function(err){
      if (err) {
        setAlert("Error")
        setSeverity("error")
        setOpenAlert(true);
      }
    })
  }

  useEffect(() => {
    prescriptions('none', search, reportState, sortParams);
  }, [])

  useEffect(() => {
    if(typeof presc.pages === 'undefined'){

    }
    else{
      if(presc.pages.current == 1){
        setDisableBeforeButton(true)
      }
      else{
        setDisableBeforeButton(false)
      }
      if (presc.pages.range == presc.pages.count){
        setDisableNextButton(true)
      }
      else{
        setDisableNextButton(false)
      }
    }
  }, [presc])

  useEffect(() => {
    prescriptions("none", search, reportState, sortParams)
  }, [sortParams])

  async function prescriptionEdit(id, action) {
    axios({
      method: 'POST',
      url: '/api/prescriptionEdit',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'X-CSRF-Token': localStorage.getItem('csrfToken')
      },
      data: {
        reportId: id,
        action: action
      },
      credentials: "include",
      mode: 'cors'
    })
    .then(function(res) {
      if(res.data.result == "Update successful"){
        prescriptions('none', search, reportState, sortParams)
        if (res.data.action == "check"){
          setAlert("Report checked")
        }
        else if (res.data.action == "restore"){
          setAlert("Report unchecked")
        }
        setSeverity("success")
        setOpenAlert(true)
      }
      else if(res.data.result == "Update error"){
        prescriptions('none', search,)
        setAlert("Update error")
        setSeverity("error")
        setOpenAlert(true)
      }
      else if(res.data.result == "Session expired"){
        setAlert("Session expired")
        setSeverity("error")
        setOpenAlert(true)
        history.replace("/login")
      }
    })
    .catch(function(err){
      if (err) {
        setAlert("Error")
        setSeverity("error")
        setOpenAlert(true)
      }
    })
  };
  
  async function logout() {
    axios({
      method: 'POST',
      url: '/api/logout',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'X-CSRF-Token': localStorage.getItem('csrfToken')
      },
      credentials: "include",
      mode: 'cors'
    })
    .then(function(res) {
      if (res.data.result == "Logged out"){
        history.replace("/login")
      }
      else{
        history.replace("/login")
      }
    })
    .catch(function(err){
      if (err) {
        setAlert("Error")
        setSeverity("error")
        setOpenAlert(true);
        history.replace("/login")
      }
    })
  }

  const handleDrawerOpen = () => {
    setOpenMenu(true)
  };

  const handleDrawerClose = () => {
    setOpenMenu(false)
  };

  async function searchBar(search){
    setSearch(search)
    prescriptions("none", search, reportState, sortParams)
  };

  const listItem = (selection) => {
    switch(selection){
      case "unreviewed":
        setListItemSelected(1)
        setReportState(selection)
        prescriptions("none", search, selection)
        break
      case "reviewed":
        setListItemSelected(2)
        setReportState(selection)
        prescriptions("none", search, selection)
        break
    }
    
  };

  const handleClickSort = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSort = () => {
    setAnchorEl(null);
  };

  const clickSort = (event) => {
    if (event.target.checked){
      setSortParams(event.target.id)
    }
    else{
      setSortParams("")
    }
  }

  const skeletons = []

  for(var i = 0; i<10; i++){
    skeletons.push(<Skeleton variant="rect" height={61} animation="wave" key={i} />)
  }

  return (
    <Fragment>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar} elevation={1} >
          <Toolbar className={classes.toolBar}>
            <IconButton 
              aria-label="menu"
              onClick={openMenu ? handleDrawerClose : handleDrawerOpen}
              edge="start"
              className={classes.iconButtons}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap style={{color: theme.palette.text.primary}}>
              Dashboard
            </Typography>
            <Paper component="div" elevation={0} className={classes.searchPaper}>
              <IconButton className={classes.iconButtons} aria-label="search">
                <SearchIcon />
              </IconButton>
              <InputBase
                className={classes.searchInput}
                placeholder="Search"
                onChange={(e) => searchBar(e.target.value)}
              />
              <Divider className={classes.searchDivider} orientation="vertical" />
              <IconButton className={classes.iconButtons} aria-label="sort" onClick={handleClickSort}>
                <SortIcon />
              </IconButton>
              <Menu 
                style={{top:40, left: -40}}
                id="sort-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseSort}
              >
                <ListItem >
                  <Checkbox
                    id="creationSort"
                    onChange={clickSort}
                  />
                  Creation date
                </ListItem>
              </Menu>
            </Paper>
            <IconButton 
              aria-label="before"
              onClick={() => prescriptions("back", search, reportState, sortParams)}
              edge="start"
              className={classes.iconButtons}
              disabled={disableBeforeButton}
            >
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton 
              aria-label="next"
              onClick={() => prescriptions("next", search, reportState, sortParams)}
              edge="start"
              className={classes.iconButtons}
              disabled={disableNextButton}
            >
              <NavigateNextIcon />
            </IconButton>
            <Typography className={classes.texts}>
            {isLoaded ?
              presc.pages.current + '-' + presc.pages.range + ' of ' + presc.pages.count
            : ''}
            </Typography>   
            <IconButton 
              aria-label="theme"
              onClick={toggleTheme}
              edge="start"
              style={{marginLeft: 'auto'}}
              className={classes.iconButtons}
            >
              {localStorage.getItem('theme') == 'light' ? <NightIcon /> : <SunIcon />}
            </IconButton>
            <IconButton 
              className={classes.iconButtons} 
              aria-label="logout"
              edge="start"
              onClick={() => logout()}
              style={{marginLeft: '1%'}}
            >
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.toolbar} />
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: openMenu,
            [classes.drawerClose]: !openMenu,
          })}
          classes={{
            paper: clsx({ 
              [classes.drawerOpen]: openMenu, 
              [classes.drawerClose]: !openMenu,
            }),
          }}
          anchor="left"
          PaperProps={{ elevation: 2 }}
        >
          <div className={classes.toolbar} />
          <List>
            <ListItem 
              button key="unreviewed"
              onClick={() => listItem("unreviewed")}
              className={clsx(classes.listItem,{
                [classes.listItemSelected]: listItemSelected == 1
              })} 
            >
              <ListItemIcon><AssignmentIcon /></ListItemIcon>
              <ListItemText primary={"Unreviewed"}/>
            </ListItem>
            <ListItem 
              button key="reviewed"
              onClick={() => listItem("reviewed")} 
              className={clsx(classes.listItem,{
                [classes.listItemSelected]: listItemSelected == 2
              })}
            >
              <ListItemIcon><AssignmentTurnedInIcon /></ListItemIcon>
              <ListItemText primary={"Completed"}/>
            </ListItem>
          </List>
        </Drawer>
        <Scrollbars
          renderThumbVertical={props => <div {...props} className={classes.thumbVertical}/>}
          autoHeight
          autoHeightMin={'100vh'}
          autoHide
          autoHideTimeout={1000}
        >
          <main className={classes.content}>
            {isLoaded ? presc.report.map((presc2) => (
              <Accordion key={presc2._id} elevation={2} props={theme}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <div className={classes.accordionColumn} style={{width: 120}}>
                    <Typography className={classes.accordionTitle}>{"Ward "+presc2.ward}</Typography>
                  </div>
                  <Divider orientation="vertical" className={classes.accordionDivider} flexItem/>
                  <div className={classes.accordionColumn} style={{width: '30%', textAlign: 'center'}}>
                    <Typography 
                      className={classes.accordionTitle}
                    >
                      {'Dr. ' + presc2.doctor.name}    
                    </Typography>
                  </div>
                  <Divider orientation="vertical" className={classes.accordionDivider} flexItem style={{marginRight: 40}}/>
                  <div className={classes.accordionColumn}>
                    <Typography className={classes.accordionTitle}>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(presc2.date))}</Typography>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{display: 'flex'}}>
                    <div style={{marginRight: 200}}>
                    <Typography variant="h6">Notes:</Typography>
                    <Typography>{presc2.notes}</Typography><br />
                    <Typography variant="h6">Prescription:</Typography>
                    {presc2.presc.map((medication) => 
                      <Typography key={medication._id}>{medication.name}</Typography>
                    )}
                    </div>
                  </div> 
                </AccordionDetails>
                <AccordionActions>
                  {presc2.checked ?
                    <IconButton
                      id={presc2._id}
                      aria-label="check"
                      onClick={() => prescriptionEdit(presc2._id, "restore")}
                      edge="start"
                    >
                      <RestoreIcon style={{height: '30px', width: '30px'}}/>
                    </IconButton>
                  : 
                    <IconButton
                    id={presc2._id}
                    aria-label="check"
                    onClick={() => prescriptionEdit(presc2._id, "check")}
                    edge="start"
                    >
                      <CheckIcon style={{height: '30px', width: '30px'}}/>
                    </IconButton>
                  }
                </AccordionActions>
              </Accordion>
            )): skeletons}
          </main> 
          </Scrollbars> 
      </div>
      <Snackbar open={openAlert} autoHideDuration={2000} 
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity={severity}>
          {alert}
        </Alert>
      </Snackbar>
    </Fragment>
  );
}