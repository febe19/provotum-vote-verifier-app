import React from 'react';
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import HelpIcon from '@material-ui/icons/Help'
import Button from '@material-ui/core/Button';
import './OverallCSS.css'
import {
    RAT,
    AppStatus
} from '../Redux/Reducer'

// The intro is used as a start site. Furthermore it resets the Redux store when coming back from verification

const Intro = () => {
    const dispatch = useDispatch()

    // Reset Redux Store 
    dispatch({ type: RAT.RESET });
    dispatch({ type: RAT.STATUS, payload: AppStatus.INTRO })

    return (
        <div>
            <div className="cardDiv">
                <h1>Welcome</h1>
                <p style={{display: 'inline-block'}}>This application is used for vote verification in the provotum environment. For information about vote verification press on the <i>Help Button</i> in the top right corner.</p>
                <p>To verify your vote follow the steps below:</p>
                <ol style={{marginTop: 0}}>
                    <li>Encrypt the vote on the voting device.</li>
                    <li>Select <i>VERIFY</i> on this device and then scan the displayed QR-codes displayed on the voting device.</li>
                </ol>
                <h3>Important</h3>
                <p>The device you want to use to verify the vote must have a camera and must be different from the device you are voting on.</p>
                <p>It is suggested to vote on a computer and verify the vote with a smartphone or tablet.</p>
            </div>
            <div className="buttonDivPosition">
                <div className="buttonDiv">
                    <div className="buttonStyle">
                        <Link to="/scanner" style={{ textDecoration: 'none' }}>
                            <Button variant="contained" color="primary" fullWidth={true}>Verify</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Intro;