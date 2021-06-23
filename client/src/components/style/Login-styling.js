import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    container: {
        transform: 'translate(-50%)',
    },
    button: {
        // 'rgb(44, 56, 72)'
        background: theme.palette.background.login,
        color: theme.palette.text.primary,
        fontSize: '110%',
        border: 0,
        borderRadius: 3,
        height: 48,
        width: '40%',
        padding: '0 30px',
        marginTop: '5%',
        transition: '0.2s',
        '&:hover': {
            backgroundColor: theme.palette.background.login2
         },
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '60%',
    },
    form: {
        width: '80%'
    },
    title: {
        paddingBottom: '20px',
        color: theme.palette.text.primary
    }
}));