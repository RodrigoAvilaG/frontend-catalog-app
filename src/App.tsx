import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Login from './components/Login';
import ProductManager from './components/ProductManager';
import StoreSelector from './components/StoreSelector';
import PublicStore from './components/PublicStore'; // 🔥 Importamos nuestra nueva tienda pública

// Empaquetamos todo tu Backoffice en un solo componente limpio
function AdminZone() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [activeAdminStore, setActiveAdminStore] = useState<{ id: string, name: string } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setActiveAdminStore(null);
  };

  return (
    <>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <StorefrontIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Corporativo {activeAdminStore ? `- ${activeAdminStore.name}` : ''}
          </Typography>
          <Button color="inherit" component={Link} to="/soy-guapa">Ver Tienda</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {!token ? (
          <Login onLoginSuccess={(newToken) => setToken(newToken)} />
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button variant="outlined" color="error" onClick={handleLogout}>Cerrar Sesión</Button>
            </Box>

            {!activeAdminStore ? (
              <StoreSelector
                token={token}
                onSelectStore={(id: string, name: string) => setActiveAdminStore({ id, name })}
              />
            ) : (
              <Box>
                <Button startIcon={<ArrowBackIcon />} onClick={() => setActiveAdminStore(null)} sx={{ mb: 3 }}>
                  Volver al Lobby
                </Button>
                <ProductManager token={token} storeId={activeAdminStore.id} />
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta 1: El Panel de Control */}
        <Route path="/admin" element={<AdminZone />} />
        
        {/* Ruta 2: La Tienda Pública Dinámica */}
        <Route path="/:storeName" element={<PublicStore />} />
        
        {/* Ruta 3: Si alguien entra a la raíz (localhost:5173/), lo mandamos al Admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}