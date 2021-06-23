import { useEffect, useState } from 'react';
import { MuiThemeProvider, createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';

export const darkTheme = responsiveFontSizes(createMuiTheme({
  palette: {
    type: 'dark',
    secondary: {
        main: 'rgba(255, 255, 255, 0.5)'
    },
    background: {
        paper: 'rgb(31, 46, 66)',
        default: 'rgb(23, 36, 54)',
        customPaper: 'rgb(31, 46, 66)',
        login: 'rgb(44, 56, 72)',
        login2: 'rgb(67, 80, 102)',
        scrollBar: 'rgb(31, 60, 80)',
        scrollBar2: 'rgb(47, 80, 110)',
        searchBar : 'rgb(46, 61, 81)',
        skeleton: 'rgb(31, 46, 66)',
        chip: 'rgb(46, 61, 81)'
    },
    text: {
      accordion: '#fff'
    }
  }
}));

export const lightTheme = responsiveFontSizes(createMuiTheme({
  palette: {
    type: 'light',
    secondary: {
      main: colors.indigo[300]
    },
    background: {
      default: 'rgb(248, 249, 253)',
      customPaper: 'rgb(255, 255, 255)',
      login: colors.grey[300],
      login2: colors.grey[400],
      scrollBar: colors.grey[500],
      scrollBar2: colors.grey[700],
      searchBar : 'rgb(238, 239, 243)',
      skeleton: 'rgb(238, 239, 243)',
      chip: 'rgb(218, 219, 223)'
    },
    text: {
      accordion: colors.grey[800]
    }
  }
}));

export function useDarkMode() {
    const [theme, setTheme] = useState('dark');
    const [componentMounted, setComponentMounted] = useState(false);
  
    const setMode = mode => {
      localStorage.setItem('theme', mode)
      setTheme(mode)
    };
  
    function toggleTheme() {
      if (theme === 'light') {
        setMode('dark');
      } else {
        setMode('light');
      }
    };
  
    useEffect(() => {
      const localTheme = localStorage.getItem('theme');
      if (localTheme) {
        setTheme(localTheme);
      } else {
        setMode('light');
      }
      setComponentMounted(true);
    }, []);
  
    return [theme, toggleTheme, componentMounted]
  };