import { useEffect, useState, Fragment } from 'react';
import axios from 'axios'
import { InterfaceStyle, Accordion, AccordionSummary, Skeleton, Autocomplete } from './style/Dashboard1-styling'
import { CssBaseline, List, ListItem, ListItemText, ListItemIcon, 
          Divider, Container, Grid, Paper, Avatar, TextField, Button, 
          Typography, Link, Snackbar, AppBar, Toolbar, InputBase, IconButton, 
          Drawer, Card, CardContent, CardActions, CardHeader, Collapse,
          AccordionDetails, AccordionActions, Menu, MenuItem, Checkbox,
          InputAdornment, Chip } from '@material-ui/core'
import { Alert as MuiAlert } from '@material-ui/lab';
import { Menu as MenuIcon, Search as SearchIcon, Mail as MailIcon, Inbox as InboxIcon, 
          Brightness7 as BrightnessIcon, Brightness2 as NightIcon, ExpandMore as ExpandMoreIcon, 
          Check as CheckIcon, WbSunny as SunIcon, NavigateBefore as NavigateBeforeIcon, NavigateNext as NavigateNextIcon,
          Sort as SortIcon, ExitToApp as LogoutIcon, Assignment as AssignmentIcon, AssignmentTurnedIn as AssignmentTurnedInIcon,
          Restore as RestoreIcon, Add as AddIcon} from '@material-ui/icons';
import clsx from 'clsx';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';

export default function Dashboard1(props) {
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
  const [anchorElSort, setAnchorElSort] = useState(null);
  const [anchorElAdd, setAnchorElAdd] = useState(null);
  const [sortParams, setSortParams] = useState()
  const [medications, setMedications] = useState([{}])
  const [reportParams, setReportParams] = useState({
    ward: "", 
    healthData:{
      pressMin: "", 
      pressMax: "",
      temp: "",
      bpm: ""
    },
    medications: [],
    date: "2021-06-22T17:53:07.418Z",
    time: "Tue Jun 22 2021 12:36:15 GMT+0200 (Central European Summer Time)",
    patient: "",
  })

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
      setMedications(res.data.medications)
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

  async function reportAdd() {
    setLoaded(false)
    setAnchorElAdd(null);
    axios({
      method: 'POST',
      url: '/api/reportAdd',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'X-CSRF-Token': localStorage.getItem('csrfToken')
      },
      data: {
        reportToAdd: reportParams
      },
      credentials: "include",
      mode: 'cors'
    })
    .then(function(res) {
      if (res.data.result == "Added"){
        setAlert("Report added")
        setSeverity("success")
      }
      else if (res.data.result == "Add error"){
        setAlert("Add error")
        setSeverity("error")
      }
      setOpenAlert(true)
      prescriptions("none", search, reportState, sortParams)
    })
    .catch(function(err){
      if (err) {
        setAlert("Error")
        setSeverity("error")
      }
      prescriptions("none", search, reportState, sortParams)
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
    setAnchorElSort(event.currentTarget);
  };

  const handleCloseSort = () => {
    setAnchorElSort(null);
  };

  const clickSort = (event) => {
    if (event.target.checked){
      setSortParams(event.target.id)
    }
    else{
      setSortParams("")
    }
  }

  const handleClickAdd = (event) => {
    setAnchorElAdd(event.currentTarget);
  };

  const handleCloseAdd = () => {
    setAnchorElAdd(null);
  };

  const handleDateChange = (date) => {
    setReportParams(reportParams => ({...reportParams, date: date}))
  }

  const handleTimeChange = (date, string) => {
    console.log(date)
    setReportParams(reportParams => ({...reportParams, time: date}))
  }

  const handleWardChange = (event) => {
    setReportParams(reportParams => ({...reportParams, ward: event.target.value}))
  }

  const handlePressMinChange = (event) => {
    setReportParams(reportParams => ({...reportParams, healthData:{...reportParams.healthData, pressMin: event.target.value}}))
  }

  const handlePressMaxChange = (event) => {
    setReportParams(reportParams => ({...reportParams, healthData:{...reportParams.healthData, pressMax: event.target.value}}))
  }

  const handleTempChange = (event) => {
    setReportParams(reportParams => ({...reportParams, healthData:{...reportParams.healthData, temp: event.target.value}}))
  }

  const handleBpmChange = (event) => {
    setReportParams(reportParams => ({...reportParams, healthData:{...reportParams.healthData, bpm: event.target.value}}))
  }

  const handleNotesChange = (event) => {
    setReportParams(reportParams => ({...reportParams, notes: event.target.value}))
  }

  const handleFiscalChange = (event) => {
    setReportParams(reportParams => ({...reportParams, patient: event.target.value}))
  }

  const handleMedicationsChange = (event, values) => {
    console.log(values)
    setReportParams(reportParams => ({...reportParams, medications: values}))
  }

  const handleReportAdd = () => {
    reportAdd()
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
                  anchorEl={anchorElSort}
                  keepMounted
                  open={Boolean(anchorElSort)}
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
            <Button 
              variant="contained" 
              disableElevation 
              className={classes.addButton}
              onClick={handleClickAdd}
            >
              <AddIcon />
              &nbsp;&nbsp;Add report
            </Button>
            <Menu 
              id="add-menu"
              anchorEl={anchorElAdd}
              keepMounted
              open={Boolean(anchorElAdd)}
              onClose={handleCloseAdd}
              style={{left: 200}}
            >
              <KeyboardDatePicker
                autoOk
                variant="inline"
                inputVariant="outlined"
                label="Date"
                format="dd/MM/yyyy"
                value={reportParams.date}
                InputAdornmentProps={{ position: "start" }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                onChange={handleDateChange}
                className={classes.addMenuItems}
              />
              <KeyboardTimePicker
                autoOk
                variant="inline"
                inputVariant="outlined"
                label="Time"
                ampm={false}
                value={reportParams.time}
                InputAdornmentProps={{ position: "start" }}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
                onChange={handleTimeChange}
                className={classes.addMenuItems}
              />
              <TextField
                select
                label="Ward"
                variant="outlined"
                value={reportParams.ward}
                className={classes.addMenuItems}
                onChange={handleWardChange}
                style={{width: 100}}
              >
                <MenuItem key={1} value={1}>
                  1
                </MenuItem>
                <MenuItem key={2} value={2}>
                  2
                </MenuItem>
                <MenuItem key={3} value={3}>
                  3
                </MenuItem>
              </TextField><br />
              <TextField 
                variant="outlined"
                label="Press min"
                className={classes.addMenuItems}
                value={reportParams.pressMin}
                style={{width: 160, marginRight: 0}}
                onChange={handlePressMinChange}
                InputProps={{
                  endAdornment: <InputAdornment disablePointerEvents={true} position="end">mmHg</InputAdornment>
                }}
              />
              <TextField 
                variant="outlined"
                label="Press max"
                className={classes.addMenuItems}
                value={reportParams.pressMax}
                style={{width: 160, marginRight: 0}}
                onChange={handlePressMaxChange}
                InputProps={{
                  endAdornment: <InputAdornment disablePointerEvents={true} position="end">mmHg</InputAdornment>
                }}
              />
              <TextField 
                variant="outlined"
                label="Temp"
                className={classes.addMenuItems}
                value={reportParams.temp}
                style={{width: 90, marginRight: 0}}
                onChange={handleTempChange}
                InputProps={{
                  endAdornment: <InputAdornment disablePointerEvents={true} position="end">{'\u00b0'}</InputAdornment>
                }}
              />
              <TextField 
                variant="outlined"
                label="bpm"
                className={classes.addMenuItems}
                value={reportParams.bpm}
                style={{width: 110, marginRight: 0}}
                onChange={handleBpmChange}
                InputProps={{
                  endAdornment: <InputAdornment disablePointerEvents={true} position="end">bpm</InputAdornment>
                }}
              /><br />
              <TextField 
                variant="outlined"
                label="Notes"
                multiline
                rows={3}
                className={classes.addMenuItems}
                value={reportParams.notes}
                onChange={handleNotesChange}
                style={{width: 580}}
              /><br />
              <TextField 
                variant="outlined"
                label="Patient fiscal code"
                className={classes.addMenuItems}
                onChange={handleFiscalChange}
                style={{width: 580}}
                value={reportParams.patient}
              /><br />
                <Autocomplete
                  id="medicationMenu"
                  options={medications}
                  getOptionLabel={(option) => option.name}
                  className={classes.addMenuItems}
                  value={reportParams.medications}
                  multiple={true}
                  onChange={handleMedicationsChange}
                  renderInput={(params) => <TextField {...params} label="Medications" variant="outlined" />}
                />
                <Button 
                  className={classes.addButton2}
                  onClick={handleReportAdd}
                >
                  Add
                </Button>
            </Menu>
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
                    <div className={classes.accordionColumn}>
                      <Typography className={classes.accordionTitle}>{"Ward "+presc2.ward}</Typography>
                    </div>
                    <Divider orientation="vertical" className={classes.accordionDivider} flexItem/>
                    <div className={classes.accordionColumn}>
                      <Typography className={classes.accordionTitle}>{'Dr. ' + presc2.doctor.name}</Typography>
                    </div>
                    <Divider orientation="vertical" className={classes.accordionDivider} flexItem/>
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
                      <div>
                      <Typography variant="h6">Health data:</Typography>
                      <Typography>{"Press min: " + presc2.healthData.pressMin + " mmHg" +  "\u00A0 \u00A0 \u00A0 \u00A0Press max: " + presc2.healthData.pressMax + " mmHg"}</Typography>
                      <Typography>{"Temperature: " + presc2.healthData.temp + "\u00b0 \u00A0 \u00A0 \u00A0 \u00A0 \u00A0 \u00A0 \u00A0Heart rate: " + presc2.healthData.bpm + " bpm "}</Typography><br />
                      <Typography variant="h6">Patient:</Typography>
                      <Typography>{"Name: " + presc2.patient.name +  "\u00A0 \u00A0 \u00A0 \u00A0 Fiscal code: " + presc2.patient._id}</Typography>
                      </div>
                    </div> 
                  </AccordionDetails>
                  <AccordionActions>
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