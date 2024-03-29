import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help'
import InfoIcon from '@material-ui/icons/Info';
import Button from '@material-ui/core/Button';
import logo from './../pv-logo-light-diamond.svg';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import {
  getAppStatus,
  getHelpOpen,
  getSelectionConfirmed,
} from '../Redux/Selector';
import {
  AppStatus,
  RAT
} from '../Redux/Reducer'

// This component includes the header bar and the help cards. 
// The Help COntent is determined via Redux Store and the curernt AppStatus which is set whenever some steps are archieved in the flow.
// HelpOpen and Close is also stored to redux, such that other components can determine wheter help is open curently. 

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
  const dispatch = useDispatch();
  const appStatus = useSelector(getAppStatus)
  const helpOpen = useSelector(getHelpOpen)
  const selectionConfirmed = useSelector(getSelectionConfirmed)

  const helpClicked = () => {
    console.log("Help Clicked in: ", appStatus);
    dispatch({ type: RAT.HELP_OPEN, payload: true })
  }

  const handleClose = () => {
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
            {!(appStatus === AppStatus.NOT_FOUND || (appStatus === AppStatus.RESULT && !selectionConfirmed)) &&
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

      {helpOpen && <div className="blur" />}

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={helpOpen}
        autoHideDuration={10000}
        onClose={handleClose}
      >
        <div className="helpSnackbar">
          <div className="helpFlexBox">
            <div className="Item">
              <div className='TitelBox'>
                <InfoIcon fontSize="large" />
                <h3 style={{ margin: 'auto', marginLeft: '3%' }}>HELP</h3>
              </div>
            </div>
            <div className="Item">
              {appStatus === AppStatus.INTRO &&
                <div>
                  <div>
                    Vote verification is an important tool in eVoting to ensure correct encryption of a ballot by the voting device. With the help of vote verification, it is possible to detect untrustworthy voting devices. You should never vote with untrustworthy devices.
                  </div>
                  <div>
                    <br/>
                    This application helps you to verify your ballot and the encryption thereof. Whenever you have questions, click on the question mark in the top right corner.
                  </div>
                </div>
              }
              {appStatus === AppStatus.SCAN_COMMITMENT &&
                <div>
                  <div>
                    Here you have to scan the commitment.
                  </div>
                  <div>
                    The commitment is a QR code displayed on the voting device.
                  </div>
                </div>
              }
              {appStatus === AppStatus.CHALLENGE_OR_CAST &&
                <div>
                  <div>
                    On the top of the screen, you see the commitment. This includes the ballot's hash and a visual representation thereof. Compare the numbers and/or the visualization with the one showed on the voting device.
                  </div>
                  <div style={{ marginTop: '2%' }}>
                    Here you have can either select <i>CHALLENGE</i> or <i>CAST</i>.
                  </div>
                  <div style={{ fontWeight: 'bold' }}>Challenge </div>
                  <div>You can challenge the encryption and trustworthiness of the voting device.</div>
                  <div style={{ fontWeight: 'bold' }}>Cast </div>
                  <div>You can cast the ballot and finish voting on the voting device</div>
                </div>
              }
              {appStatus === AppStatus.SCAN_CHALLENGE &&
                <div>
                  <div>
                    Here you have to scan the challenge.
                  </div>
                  <div>
                    The challenge is a combination of multiple QR-codes that will be visible on the voting device.
                  </div>
                  <div>
                    Just keep the camera on the QR-codes until the Scan-Progress shows ticks in every circle.
                  </div>
                </div>
              }
              {appStatus === AppStatus.CONFIRM_SELECTION &&
                <div>
                  <div>
                    Here you have to confirm if the shown voting options are the ones you selected on the voting device.
                  </div>
                  <div style={{display: 'inline-block'}}>
                    If so, confirm with <i>YES</i>, else deny with <i>NO</i>.
                  </div>
                </div>
              }
              {appStatus === AppStatus.RESULT && selectionConfirmed &&
                <div>
                  <div>
                    Here you see the result of the vote verification.
                  </div>
                  <div>
                    If the encryption is similar your vote was encrypted correctly on the voting device and the voting device is trustworthy.
                  </div>
                  <div style={{display: 'inline-block'}}>
                    Select <i>BACK TO START</i> on both devices and start a new round in which you may cast your vote.
                  </div>
                </div>
              }
            </div>
          </div>
          <div className='Item'>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Button variant="outlined" onClick={handleClose} color="inherit" size="small" style={{ marginRight: '2%', marginBottom: '1%' }}>
                Close
            </Button>
            </div>
          </div>
        </div>
      </Snackbar>
    </div >
  );
}
