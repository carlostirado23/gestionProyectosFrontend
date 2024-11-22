import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem("token");

    // Si el usuario está autenticado y trata de ir al login, redirige al home
    if (isAuthenticated && window.location.pathname === "/") {
        return <Navigate to="/home" />;
    }

    // Si el usuario no está autenticado y trata de acceder a una ruta privada, redirige al login
    if (!isAuthenticated && window.location.pathname !== "/") {
        return <Navigate to="/" />;
    }

    // Permite el acceso si todo es válido
    return children;
};

export default PrivateRoute;
