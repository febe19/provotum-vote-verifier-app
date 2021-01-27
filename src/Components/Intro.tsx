import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';

import {
    RAT
} from '../Redux/Reducer'


const Intro = () => {
    const dispatch = useDispatch()
    dispatch({type: RAT.RESET});

    return (
        <div>
            <h1>Welcome</h1>
            <p>This application is used for the vote verification in the provotum environment.</p>
            <p>To verify your vote follow the steps below:</p>
            <ol>
                <li>Select "Verify" on the red application</li>
                <li>Select "Verify" on the blue application (This device)</li>
            </ol>
            <Link to="/scanner">
                <button>
                    Verify
                    </button>
            </Link>
        </div>
    )

}

export default Intro;