import { Navigate } from 'react-router-dom';

export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (const element of ca) {
        let c = element;
        while (c.startsWith(' ')) {
            c = c.substring(1);
        }
        if (c.startsWith(name)) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

export function parseJwt(token) {
    if (!token) {
        return "";
    }
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const RequireAuth = ({ children }) => {
    const token = getCookie("token");
    if (!token || token === "") {
        return <Navigate to="/login" />;
    }
    return children;
};

export default RequireAuth;