import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "./hook/useAuth";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import Loader from '../../layouts/loader/Loader';

const AuthInterface = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { register: authRegister, login, loading, error, success } = useAuth();
    const [companias, setCompanias] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false); // Estado para el Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Puede ser 'success' o 'error'
    const navigate = useNavigate();
    const [redirecting, setRedirecting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setError,
        formState: { errors },
    } = useForm();

    // Carga de las compañías desde el backend
    useEffect(() => {
        const fetchCompanias = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_USER_API}/api/companias/idNombre`);
                const data = await response.json();
                setCompanias(data);
            } catch (err) {
                console.error("Error al obtener las compañias:", err);
            }
        };
        fetchCompanias();
    }, []);

    // Mostrar Snackbar según el estado de éxito o error
    useEffect(() => {
        if (success) {
            setSnackbarMessage(success);
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            setRedirecting(true);

            // Retraso antes de redirigir
            setTimeout(() => {
                navigate("/home");
            }, 2000); // 2 segundos de retraso
        }
        if (error) {
            setSnackbarMessage(error);
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    }, [success, error]);

    // Manejo del cierre del Snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") return;
        setOpenSnackbar(false);
    };

    // Manejo del envío del formulario
    const onSubmit = async (data) => {
        if (isLogin) {
            try {
                await login(data);
                //navigate("/home"); // Redirige a la página de inicio
            } catch (err) {
                console.error("Error al iniciar sesión:", err);
            }
        } else {
            // Validación de contraseñas coincidentes
            if (data.contrasena !== data.confirmContrasena) {
                setError("confirmContrasena", {
                    type: "manual",
                    message: "Las contraseñas no coinciden",
                });
                return;
            }

            try {
                await authRegister(data);
            } catch (err) {
                console.error("Error al registrarse:", err);
            }
        }
        reset();
    };

    return (
        <div className="absolute inset-0 -z-10 h-screen w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
            <div className="flex items-center justify-center h-screen">
                {loading || redirecting ? (
                    <Loader />
                ) : (
                    <div className="w-auto p-8 rounded-lg shadow-lg bg-slate-50">
                        <h2 className="mb-4 text-lg font-bold">{isLogin ? "Iniciar Sesión" : "Registrarse"}</h2>
                        {loading && <p className="text-sm text-lila">Cargando...</p>}

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex gap-7">
                                {!isLogin && (
                                    <div className="mb-4">
                                        <div className="mb-4">
                                            <label className="mb-2 text-sm font-bold text-gray-700 " htmlFor="nombre">
                                                Nombres
                                            </label>
                                            <input
                                                className="w-full px-3 py-2 text-gray-700 border rounded shadow"
                                                id="nombre"
                                                {...register("nombre", { required: "El nombre es requerido" })}
                                            />
                                            {errors.nombre && (
                                                <p className="text-sm text-red-500">{errors.nombre.message}</p>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label className="mb-2 text-sm font-bold text-gray-700 " htmlFor="apellido">
                                                Apellidos
                                            </label>
                                            <input
                                                className="w-full px-3 py-2 text-gray-700 border rounded shadow"
                                                id="apellido"
                                                {...register("apellido", { required: "El apellido es requerido" })}
                                            />
                                            {errors.apellido && (
                                                <p className="text-sm text-red-500">{errors.apellido.message}</p>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label
                                                className="mb-2 text-sm font-bold text-gray-700 "
                                                htmlFor="compania_id">
                                                Compañia
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 text-gray-700 border rounded shadow"
                                                id="compania_id"
                                                {...register("compania_id", { required: "La compañía es requerida" })}>
                                                <option value="">Seleccionar compañía</option>
                                                {companias.map((compania) => (
                                                    <option key={compania.id} value={compania.id}>
                                                        {compania.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.compania_id && (
                                                <p className="text-sm text-red-500">{errors.compania_id.message}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <div className="mb-4">
                                        <label className="mb-2 text-sm font-bold text-gray-700 " htmlFor="correo">
                                            Correo electrónico
                                        </label>
                                        <input
                                            className="w-full px-3 py-2 text-gray-700 border rounded shadow"
                                            id="correo"
                                            {...register("correo", {
                                                required: "El correo electrónico es requerido",
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: "Formato de correo inválido",
                                                },
                                            })}
                                        />
                                        {errors.correo && (
                                            <p className="text-sm text-red-500">{errors.correo.message}</p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label className="mb-2 text-sm font-bold text-gray-700 " htmlFor="contrasena">
                                            Contraseña
                                        </label>
                                        <input
                                            className="w-full px-3 py-2 text-gray-700 border rounded shadow"
                                            id="contrasena"
                                            type="password"
                                            {...register("contrasena", {
                                                required: "La contraseña es requerida",
                                                minLength: {
                                                    value: 4,
                                                    message: "La contraseña debe tener al menos 4 caracteres",
                                                },
                                            })}
                                        />
                                        {errors.contrasena && (
                                            <p className="text-sm text-red-500">{errors.contrasena.message}</p>
                                        )}
                                    </div>

                                    {!isLogin && (
                                        <div className="mb-4">
                                            <label
                                                className="mb-2 text-sm font-bold text-gray-700 "
                                                htmlFor="confirmContrasena">
                                                Confirmar contraseña
                                            </label>
                                            <input
                                                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                                id="confirmContrasena"
                                                type="password"
                                                {...register("confirmContrasena", {
                                                    required: "La confirmación de contraseña es requerida",
                                                })}
                                            />
                                            {watch("contrasena") !== watch("confirmContrasena") &&
                                                !errors.confirmContrasena && (
                                                    <p className="text-sm text-red-500">Las contraseñas no coinciden</p>
                                                )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                className="px-4 py-2 font-bold text-white rounded bg-violet-600 hover:bg-violet-700"
                                type="submit"
                                disabled={loading || redirecting}>
                                {isLogin ? "Iniciar Sesión" : "Registrarse"}
                            </button>
                            <p className="mt-4 text-sm text-gray-700">
                                {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
                                <span
                                    className="cursor-pointer text-violet-600 hover:text-violet-700"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        reset();
                                    }}>
                                    {isLogin ? " Registrarse" : " Iniciar Sesión"}
                                </span>
                            </p>
                        </form>
                    </div>
                )}
            </div>
            {/* Snackbar con Alert */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AuthInterface;
