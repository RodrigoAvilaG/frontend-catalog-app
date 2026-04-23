import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Container, Button, Box, Card, CardContent, CircularProgress, CardActions, CardMedia, Grid } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Login from './components/Login';
import ProductManager from './components/ProductManager';
import StoreSelector from './components/StoreSelector';

function App() {
  const [store, setStore] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAdminView, setIsAdminView] = useState(false);

  // 🔥 NUEVO ESTADO: Guarda la tienda que estamos administrando
  const [activeAdminStore, setActiveAdminStore] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    // Esto carga la tienda pública por defecto
    fetch('http://localhost:3000/stores/soy-guapa')
      .then((res) => res.json())
      .then((data) => { setStore(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setActiveAdminStore(null); // Al salir, lo sacamos del backoffice
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <StorefrontIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {isAdminView && activeAdminStore ? `Admin: ${activeAdminStore.name}` : store?.name}
          </Typography>

          <Button
            color="inherit"
            startIcon={<AdminPanelSettingsIcon />}
            onClick={() => setIsAdminView(!isAdminView)}
            sx={{ mr: 2 }}
          >
            {isAdminView ? 'Ver Tienda Pública' : 'Admin'}
          </Button>

          {!isAdminView && (
            <Button color="inherit" startIcon={<ShoppingCartIcon />}>
              Carrito (0)
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {isAdminView ? (
        // --- ZONA ADMIN ---
        !token ? (
          <Login onLoginSuccess={(newToken) => setToken(newToken)} />
        ) : (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button variant="outlined" color="error" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </Box>

            {/* 🔥 EL CONTROL DE TRÁFICO */}
            {!activeAdminStore ? (
              // Si no ha elegido tienda, mostramos el Lobby
              <StoreSelector
                token={token}
                onSelectStore={(id: string, name: string) => setActiveAdminStore({ id, name })}
              />
            ) : (
              // Si ya eligió tienda, mostramos el Product Manager de esa sucursal
              <Box>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => setActiveAdminStore(null)}
                  sx={{ mb: 3 }}
                >
                  Volver al Lobby
                </Button>
                <ProductManager token={token} storeId={activeAdminStore.id} />
              </Box>
            )}
          </Container>
        )
      ) : (
        // --- ZONA CLIENTE (Pública) ---
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {store?.products && store.products.length > 0 ? (
            <Grid container spacing={4}>
              {store.products.map((product: any) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x300?text=Sin+Foto'}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{product.description}</Typography>
                      <Typography variant="h6" color="primary">${product.price}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" variant="contained" fullWidth>Agregar al carrito</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="h6" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
              Aún no hay productos en esta tienda.
            </Typography>
          )}
        </Container>
      )}
    </>
  );
}

export default App;