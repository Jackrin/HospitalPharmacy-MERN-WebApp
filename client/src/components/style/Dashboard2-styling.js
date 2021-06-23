import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import { AccordionSummary as MuiAccordionSummary, Accordion as MuiAccordion } from "@material-ui/core";
import { Skeleton as MuiSkeleton } from '@material-ui/lab';

const drawerWidth = 240;
const appBarHeight = 64;

export const InterfaceStyle = makeStyles((theme) => ({
  root: {
      display: 'flex',
      width: '100vw',
      height: '100vh'
  },
  appBar: {
      width: '100vw',
      height: appBarHeight,
      backgroundColor: theme.palette.background.customPaper,
      zIndex: theme.zIndex.drawer + 1,
  },
  toolBar: {
  },
  drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    backgroundColor: theme.palette.background.customPaper,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    border: 'none',
    top: appBarHeight,
    height: '100vh'
  
  },
  drawerClose: {
    backgroundColor: theme.palette.background.customPaper,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7) + 1,
    },
    border: 'none',
    marginTop: appBarHeight
  },
  listItem: {
    '&:hover': {
      backgroundColor: theme.palette.background.searchBar
    },
    marginBottom: 10
  },
  listItemSelected: {
    backgroundColor: theme.palette.background.searchBar
  },
  toolbar: theme.mixins.toolbar,
  iconButtons: {
    padding: 10,
    color: theme.palette.text.primary
  },
  searchPaper: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
    backgroundColor: theme.palette.background.searchBar,
    marginLeft: 106,
    marginRight: 20
  },
  searchInput: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  searchDivider: {
    height: 28,
    margin: 4,
  },
  texts: {
    color: theme.palette.text.primary
  },
  column: {
    flexBasis: '33.33%',
  },
  accordionDivider: {
    fontSize: '10px',
    background: theme.palette.text.disabled
  },
  content: {
    flex: 1,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(3),
    marginTop: appBarHeight,
    minHeight: 0,
    minWidth: 0,
  },
  accordionTitle: {
    fontSize: theme.typography.pxToRem(25),
    fontWeight: theme.typography.fontWeightRegular,
  },
  accordionColumn: {
  },
  thumbVertical: {
    backgroundColor: theme.palette.background.scrollBar,
    borderRadius: 2,
    '&:hover': {
      backgroundColor: theme.palette.background.scrollBar2
    },
    '&:active': {
      backgroundColor: theme.palette.background.scrollBar2
    }, 
  },
}));

export const Accordion = withStyles((theme) => ({
  root: {
    "&.MuiAccordion-root:before": {
      height: 0,
    },
    paddingLeft: '3%',
    marginBottom: 18,
  },
  rounded: {
    borderRadius: '4px'
  },
  expanded: {
    "&$expanded": {
      margin: 0,
      marginBottom: 18
    }
  },
}))(MuiAccordion);

export const AccordionSummary = withStyles((theme) => ({
  root: {
    "&$expanded": {
      minHeight: 56
    },
    color: theme.palette.text.primary,
  },
  content: {
    "&$expanded": {
      margin: "12px 0"
    }
  },
  expanded: {}
}))(MuiAccordionSummary);

export const Skeleton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.skeleton,
    marginBottom: 18
  },
}))(MuiSkeleton);