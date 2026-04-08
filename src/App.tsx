import { AppBar, Toolbar, Typography, Container, Button, Box, Card, CardContent } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function App() {
  return (
    <>
      {/* 1. BARRA DE NAVEGACIÓN SUPERIOR */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <StorefrontIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Soy Guapa - Catálogo
          </Typography>
          <Button color="inherit" startIcon={<ShoppingCartIcon />}>
            Carrito (0)
          </Button>
        </Toolbar>
      </AppBar>

      {/* 2. CONTENEDOR PRINCIPAL */}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        
        {/* 🔥 CORRECCIÓN 1: Usamos sx para el Box */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            ¡Bienvenido a tu tienda!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Material UI está configurado y listo para la acción.
          </Typography>
        </Box>

        {/* 3. TARJETA DE EJEMPLO */}
        <Card sx={{ maxWidth: 345, mx: 'auto', boxShadow: 3 }}>
          
          {/* 🔥 CORRECCIÓN 2: Usamos sx para el CardContent */}
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h5" component="div" gutterBottom>
              🚀 Siguiente Paso
            </Typography>
            
            {/* 🔥 CORRECCIÓN 3: Usamos sx para el margin-bottom (mb) */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Aquí conectaremos nuestro `fetch` para traer los productos de tu backend en NestJS y dibujaremos un "Grid" de tarjetas reales.
            </Typography>
            <Button variant="contained" fullWidth>
              Empezar a programar
            </Button>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default App;