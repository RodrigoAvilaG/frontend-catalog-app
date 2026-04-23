import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, CircularProgress, Grid } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';

// 1. Aquí está su lista de invitados correcta
interface StoreSelectorProps {
  token: string;
  onSelectStore: (id: string, name: string) => void; 
}

// 2. Aquí recibe el token y la función
export default function StoreSelector({ token, onSelectStore }: StoreSelectorProps) {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch('http://localhost:3000/stores/my-stores', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStores(data);
        }
      } catch (error) {
        console.error("Error cargando tiendas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [token]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Lobby Corporativo
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Selecciona la sucursal que deseas administrar el día de hoy.
      </Typography>

      {stores.length === 0 ? (
        <Typography variant="h6" color="error">
          No tienes ninguna tienda registrada. ¡Ve a tu API a crear una!
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {stores.map((store) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={store.id}>
              <Card elevation={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                  <StorefrontIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" component="h2" gutterBottom>
                    {store.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {store.products?.length || 0} productos registrados
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary"
                    onClick={() => onSelectStore(store.id, store.name)}
                  >
                    Entrar a la Sucursal
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}