import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import {
    RAT
} from '../Redux/Reducer'


const Intro = () => {
    const dispatch = useDispatch()
    dispatch({ type: RAT.RESET });

    return (
        <div style={{ margin: '10px' }}>
            <h1>Welcome</h1>
            <p>This application is used for the vote verification in the provotum environment.</p>
            <p>To verify your vote follow the steps below:</p>
            <ol>
                <li>Select "Verify" on the voting frontend</li>
                <li>Select "Verify" on the this device</li>
            </ol>
            <Link to="/scanner" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">Verify</Button>
            </Link>
        </div>
    )

}

export default Intro;