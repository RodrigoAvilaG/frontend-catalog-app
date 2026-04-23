import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Card, CardContent, CardActions, CardMedia, CircularProgress, Box, Grid } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function PublicStore() {
  // 🔥 LA MAGIA: useParams extrae la palabra de la URL (ej. "los-tacos-del-padrino")
  const { storeName } = useParams(); 
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Le pedimos al backend la tienda que dice la URL
    fetch(`http://localhost:3000/stores/${storeName}`)
      .then((res) => res.json())
      .then((data) => {
         if (data.statusCode === 404 || data.error) {
             setStore(null); // No existe
         } else {
             setStore(data);
         }
         setLoading(false);
      })
      .catch((err) => { console.error(err); setLoading(false); });
  }, [storeName]); // 🔄 Si la URL cambia, el useEffect se vuelve a ejecutar

  if (loading) return <Box sx={{ mt: 10, textAlign: 'center' }}><CircularProgress /></Box>;

  // Si alguien escribe una tienda que no existe en la URL:
  if (!store) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>Tienda no encontrada 😢</Typography>
        <Typography variant="body1">La sucursal "{storeName}" no existe en nuestro sistema.</Typography>
        <Button component={Link} to="/admin" variant="contained" sx={{ mt: 4 }}>Ir al Panel de Admin</Button>
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <StorefrontIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {store.name}
          </Typography>
          <Button color="inherit" component={Link} to="/admin" startIcon={<AdminPanelSettingsIcon />} sx={{ mr: 2 }}>
            Admin
          </Button>
          <Button color="inherit" startIcon={<ShoppingCartIcon />}>
            Carrito (0)
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {store.products && store.products.length > 0 ? (
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
    </>
  );
}