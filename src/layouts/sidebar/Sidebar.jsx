import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { useNavigate } from "react-router-dom";

// Definimos la navegación del sidebar
const NAVIGATION = [
    {
        segment: "dashboard",
        title: "Tablero",
        icon: <DashboardIcon />,
    },
];

// Creamos un tema personalizado para el dashboard
const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: "data-toolpad-color-scheme",
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

// Componente para mostrar el contenido de la página
function DemoPageContent({ pathname }) {
    return (
        <Box
            sx={{
                py: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
            }}>
            <Typography>Contenido del Dashboard para {pathname}</Typography>
        </Box>
    );
}

DemoPageContent.propTypes = {
    pathname: PropTypes.string.isRequired,
};

// Componente principal del sidebar
function Sidebar({ window }) {
    const navigate = useNavigate();

    // Estado para gestionar la sesión del usuario
    const [session, setSession] = useState({
        user: {
            name: "Bharat Kashyap",
            email: "bharatkashyap@outlook.com",
        },
    });

    // Funciones de autenticación (inicio y cierre de sesión)
    const authentication = useMemo(
        () => ({
            signOut: () => {
                localStorage.clear(); // Limpia el localStorage
                navigate("/"); // Redirige a la página de inicio de sesión
                setSession(null);
            },
        }),
        []
    );

    // Router simulado para navegación en el dashboard
    const router = useDemoRouter("/dashboard");

    // Referencia para la ventana, útil en iframes
    const demoWindow = window !== undefined ? window() : undefined;

    return (
        <AppProvider
            session={session}
            authentication={authentication}
            navigation={NAVIGATION}
            router={router}
            theme={demoTheme}
            window={demoWindow}
            title="TuNombre">
            <DashboardLayout>
                <DemoPageContent pathname={router.pathname} />
            </DashboardLayout>
        </AppProvider>
    );
}

Sidebar.propTypes = {
    // Propiedad utilizada solo para iframes en documentación
    window: PropTypes.func,
};

export default Sidebar;
