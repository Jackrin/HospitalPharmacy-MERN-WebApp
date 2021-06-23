import { AnimatePresence, motion } from 'framer-motion'
import Login from './components/Login'
import Dashboard1 from './components/Dashboard1'
import Dashboard2 from './components/Dashboard2'
import Admin from './components/Admin'
import { Switch, Route, useLocation } from "react-router-dom";
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import  {darkTheme, lightTheme, useDarkMode } from './components/style/themes'
import 'fontsource-roboto';
import { useHistory } from 'react-router-dom'
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

export default function App(){
  const [theme, toggleTheme, componentMounted] = useDarkMode();
  const themeMode = theme === 'light' ? lightTheme : darkTheme;
  const location = useLocation()
  const history = useHistory()
  const pageTransition = {
    initial2: {
      opacity: 0,
      y: "-100vh",
    },
    initial: {
      opacity: 0,
      y: "100vh",
    },
    in: {
      opacity: 1,
      y: 0,
      scale : 1
    },
    out: {
      opacity: 0,
      y: "-100vh",
      scale: 1,
    },
    out2: {
      opacity: 0,
      y: "100vh",
      scale: 1,
    }
  }

  const transitionOptions = {
    type: "spring",
    ease: "anticipate",
    duration: 0.7,
    delay: 0.1
  }

  if (!componentMounted) {
    return <div />
  };

  return (
    <MuiThemeProvider theme={themeMode}>
      <CssBaseline />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <AnimatePresence>
          <Switch location={location} key={location.pathname}>
            <Route exact path="/">
              <motion.div 
                initial="false" 
                animate="in" 
                exit="out" 
                variants={pageTransition} 
                transition={transitionOptions}
                style={{position: 'absolute', left: '50%'}}
              >
                <Login theme={themeMode} history={history}/>
              </motion.div>
            </Route>
            <Route exact path="/login">
              <motion.div 
                initial="initial2" 
                animate="in" 
                exit="out" 
                variants={pageTransition} 
                transition={transitionOptions}
                style={{position: 'absolute', left: '50%'}}
              >
                <Login theme={themeMode} history={history}/>
              </motion.div>
            </Route>
            <Route path="/dashboard1">
              <motion.div 
                initial="initial" 
                animate="in" 
                exit="out2" 
                variants={pageTransition} 
                transition={transitionOptions}
                style={{position: 'absolute'}}
              >
                <Dashboard1 theme={themeMode} toggleTheme={toggleTheme} history={history}/>
              </motion.div>
            </Route>
            <Route path="/dashboard2">
            <motion.div 
                initial="initial" 
                animate="in" 
                exit="out2" 
                variants={pageTransition} 
                transition={transitionOptions}
                style={{position: 'absolute'}}
              >
                <Dashboard2 theme={themeMode} toggleTheme={toggleTheme} history={history}/>
              </motion.div>
            </Route>
            <Route path="/admin">
              <motion.div initial="initial" animate="in" exit="out" variants={pageTransition}>
                <Admin />
              </motion.div>
            </Route>
          </Switch>
        </AnimatePresence>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
}