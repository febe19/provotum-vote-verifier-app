import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';  

const NotFound = () => {
    return (
        <div style={{ margin: '10px' }}>
            <h1>404</h1>
            <p>This site was unfortunately not found</p>
            <div>
                <Link to="/" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">Back to Homescreen</Button>
                </Link>
            </div>
        </div>
    )

}

export default NotFound;