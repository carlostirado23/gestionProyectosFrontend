import { useNavigate } from "react-router-dom";
import Sidebar from "../../layouts/sidebar/Sidebar";

const Home = () => {
    const navigate = useNavigate();

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.clear(); // Limpia el localStorage
        navigate("/"); // Redirige a la página de inicio de sesión
    };

    return (
        <>
        <Sidebar />
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="mb-4 text-2xl font-bold">¡Bienvenido a la página de inicio!</h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700">
                    Cerrar Sesión
                </button>
            </div>
        </>
    );
};

export default Home;
