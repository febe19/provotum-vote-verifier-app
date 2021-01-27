import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import logo from './../pv-logo-light-diamond.svg';
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(1),
    padding: '1px',
    margin: '1px'
  },
  title: {
    flexGrow: 1,
  },
  image: {
    widht: '60px',
    height: '60px'
  },
  toolbar: {
    paddingLeft: '1px'
  }

}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Link to="/">
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <img src={logo} className={classes.image} alt="My logo" />
            </IconButton>
          </Link>
          <Typography variant="h6" className={classes.title}>
            Provotum Vote Verifier 
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
