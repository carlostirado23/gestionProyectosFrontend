import { Navigate, Route, Routes } from "react-router-dom";
import AuthInterface from "./pages/loginAndRegister/AuthInterface";
import Home from "./pages/home/Home";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
    // token
    const isAuthenticated = !!localStorage.getItem("token");
    
    return (
        <Routes>
            {/* Ruta pública */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <AuthInterface />} />
            {/* Ruta protegida */}
            <Route
                path="/home"
                element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default App;
