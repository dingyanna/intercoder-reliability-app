import React from 'react';
import styles from './Home.css';
import { createMuiTheme } from '@material-ui/core/styles';

import {
  Drawer, CssBaseline, AppBar, Toolbar, List, Divider, IconButton,
  ListItem, InputLabel, FormControl, Select, Grid, Button, Typography,
  Paper, FormControlLabel, RadioGroup, Radio, ThemeProvider
} from '@material-ui/core'




const theme1 = createMuiTheme({
  palette: {
    primary: {
      main: '#7986cb',
    },
    secondary: {
      main: '#9fa8da',
    },
  },
});


export default function Documentation(): JSX.Element {

  return (
    <ThemeProvider theme={theme1}>
      
    </ThemeProvider>
  );
}