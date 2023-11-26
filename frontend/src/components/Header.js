import { getCookie, parseJwt } from "./RequireAuth";
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    function handleLogout(event) {
        event.preventDefault();
        document.cookie = "token=0;expires=Thu, 01 Jan 1970 00:00:01 GMT";
        navigate("/login");
    };
    function handleRedirect(event, redirect) {
        event.preventDefault();
        navigate("/" + redirect);
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <Link to="/" className="btn btn-outline-primary">Apollo</Link>
                </div>
                <div className="col">
                    <button type="button" className="btn btn-primary" onClick={event => handleRedirect(event, "admin")}>Admin Panel</button>
                    <button type="button" className="btn btn-primary" onClick={event => handleRedirect(event, "order")}>Order Here</button>
                    <button type="button" className="btn btn-primary" onClick={event => handleRedirect(event, "current-orders")}>Current Orders</button>
                </div>
                <div className="col">
                    <label>Logged in as: {parseJwt(getCookie("token")).sub}</label>
                    <button type="button" className="btn btn-secondary" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div >
    );
};