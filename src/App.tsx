import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Container, Button, Box, Card, CardContent, Grid, CircularProgress, CardActions, CardMedia } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Login from './components/Login';
import ProductManager from './components/ProductManager';

// 1. Le decimos a TypeScript cómo se ven nuestros datos
interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  images?: string[];
}

interface Store {
  id: string;
  name: string;
  products: Product[];
}

function App() {
  // 2. Memoria de nuestra app (Estado)
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAdminView, setIsAdminView] = useState(false);

  // 3. El Efecto: Ir a buscar los datos al Backend cuando la página cargue
  useEffect(() => {
    fetch('http://localhost:3000/stores/soy-guapa')
      .then((response) => {
        if (!response.ok) throw new Error('Error al cargar la tienda');
        return response.json();
      })
      .then((data) => {
        setStore(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };
  // 4. Pantalla de carga
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 5. Pantalla de Error
  if (error) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h5">{error}</Typography>
      </Container>
    );
  }

  // 6. Pantalla Principal (¡Con datos reales!)
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <StorefrontIcon sx={{ mr: 2 }} />
          {/* El nombre de la tienda ahora viene de la Base de Datos */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {store?.name}
          </Typography>
          <Button
            color="inherit"
            startIcon={<AdminPanelSettingsIcon />}
            onClick={() => setIsAdminView(!isAdminView)}
            sx={{ mr: 2 }}
          >
            {isAdminView ? 'Ver Tienda' : 'Admin'}
          </Button>
          {!isAdminView && (
            <Button color="inherit" startIcon={<ShoppingCartIcon />}>
              Carrito (0)
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {/* 🔥 RENDERIZADO CONDICIONAL: ¿Qué pantalla mostramos? */}
      {isAdminView ? (
        // --- ZONA ADMIN ---
        !token ? (
          // Si no hay token, le pedimos que inicie sesión
          <Login onLoginSuccess={(newToken) => setToken(newToken)} />
        ) : (
          // Si YA hay token, le mostramos el Backoffice (Por ahora un texto de prueba)
          <Container sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4">Panel de Control (Backoffice)</Typography>
              <Button variant="outlined" color="error" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </Box>
            <ProductManager token={token} />
          </Container>
        )
      ) : (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Nuestros Productos
          </Typography>

          {/* El Grid de Material UI para acomodar las tarjetas */}
          <Grid container spacing={4}>
            {store?.products.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x300?text=Sin+Foto'}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Typography gutterBottom variant="h5" component="h2">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${product.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" variant="contained" fullWidth>
                      Agregar al carrito
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </>
  );
}

export default App;