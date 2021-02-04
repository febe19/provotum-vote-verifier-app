import React from 'react';
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
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
    dispatch({ type: RAT.STATUS, payload: AppStatus.INTRO})

    return (
        <div>
            <div className="cardDiv">
                <h1>Welcome</h1>
                <p>This application is used for vote verification in the provotum environment.</p>
                <p>To verify your vote follow the steps below:</p>
                <ol>
                    <li>Select 'verify' on the voting device</li>
                    <li>Select 'verify' on the this device</li>
                </ol>
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