import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div>
            <h1>404</h1>
            <p>This site was unfortunately not found</p>
            <div>
                <Link to="/">
                    <button>Back to Homescreen</button>
                </Link>
            </div>
        </div>
    )

}

export default NotFound;