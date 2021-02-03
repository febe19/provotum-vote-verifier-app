import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import logo from './../pv-logo-light-diamond.svg';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import {
  getAppStatus,
  getHelpOpen,
} from '../Redux/Selector';
import {
  AppStatus,
  RAT
} from '../Redux/Reducer'

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStylesHelp = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const useStylesHeader = makeStyles((theme) => ({
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
    userSelect: "none"
  },
  image: {
    widht: '60px',
    height: '60px'
  },
  toolbar: {
    paddingLeft: '1px'
  },
  rightToolbar: {
    marginLeft: "auto",
    marginRight: "-12px"
  }
}));

export default function ButtonAppBar() {
  const classesHeader = useStylesHeader();
  const classesHelp = useStylesHelp();
  const dispatch = useDispatch();
  const appStatus = useSelector(getAppStatus)
  const helpOpen = useSelector(getHelpOpen)
  const [open, setOpen] = React.useState(false);

  const helpClicked = () => {
    console.log("Help Clicked in: ", appStatus);
    dispatch({ type: RAT.HELP_OPEN, payload: true })
  }

  const handleClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch({ type: RAT.HELP_OPEN, payload: false })
  };

  return (
    <div>
      <div className={classesHeader.root}>
        <AppBar position="static">
          <Toolbar className={classesHeader.toolbar}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <IconButton edge="start" className={classesHeader.menuButton} color="inherit" aria-label="menu">
                <img src={logo} className={classesHeader.image} alt="My logo" />
              </IconButton>
            </Link>
            <Typography variant="h6" className={classesHeader.title} >
              Provotum Vote Verifier
          </Typography>
            {!(appStatus === AppStatus.INTRO || appStatus === AppStatus.NOT_FOUND) &&
              <div>
                <section className={classesHeader.rightToolbar}>
                  <IconButton onClick={helpClicked} color="inherit" >
                    <HelpIcon fontSize="large" />
                  </IconButton>
                </section>
              </div>
            }
          </Toolbar>
        </AppBar>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={helpOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Note archived"
      >
        <Alert severity="info">
          {appStatus === AppStatus.SCAN_COMMITMENT &&
            <div>
              Here you have to scan the commitment. This is displayed on the voting device.
            </div>
          }
          {appStatus === AppStatus.CHALLENGE_OR_CAST &&
            <div>
              <div>
                Here you have can either select 'Challenge' or 'Cast'. On the top of the screen you see the commitment. This includes the ballot's hash and a visual representation thereof. Compare the Numbers and/or the visualization with the one showed on the voting device.
              </div>
              <ul>
                <li>Challenge -- You can challenge the challenge the encryption and trustworthiness of the voting device.</li>
                <li>Cast -- You can cast the ballot and finish voting</li>
              </ul>
            </div>
          }
          {appStatus === AppStatus.SCAN_CHALLENGE &&
            <div>
              Here you have to scan the challenge. The challenge is a combination of multiple QR-codes which will be visible on the voring device. Just keep the camera on the QR-codes until the Scan-Progress shows ticks in every circle.
            </div>
          }
          {appStatus === AppStatus.RESULT &&
            <div>
              Here you see the result of the vote verification. If the Encryption is similar and you voted for the displayed options, your vote was encrypted correctly on the voting device and it is trustworthy. If you did not vote for the shown options or the encryption is not similar, the voting device is not trustworthy and you should not vote with it.
            </div>
          }
        </Alert>
      </Snackbar>

    </div>
  );
}
