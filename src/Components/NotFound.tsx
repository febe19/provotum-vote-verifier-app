import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';

const NotFound = () => {
    return (
        <div>
            <div style={{ margin: '30px' }}>
                <h1>404</h1>
                <p>This site was unfortunately not found</p>
            </div >

            <div className="buttonDiv">
                <div className="buttonStyle">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" color="primary" fullWidth={true}>Back to Homescreen</Button>
                    </Link>
                </div>
            </div>
        </div>
    )

}

export default NotFound;