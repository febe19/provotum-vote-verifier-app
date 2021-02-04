import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import {
    RAT,
    AppStatus,
} from '../Redux/Reducer'

// Component shown whenever the URL is invalid. Including a back button to go to the intro page.
const NotFound = () => {
    const dispatch = useDispatch()
    dispatch({ type: RAT.STATUS, payload: AppStatus.NOT_FOUND })
    return (
        <div>
            <div className="cardDiv">
                <h1 className="centerHorizontally">404</h1>
                <p className="centerHorizontally">This site was unfortunately not found.</p>
            </div >

            <div className="buttonDivPosition">
                <div className="buttonDiv">
                    <div className="buttonStyle">
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <Button variant="contained" color="primary" fullWidth={true}>Back to Homescreen</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default NotFound;