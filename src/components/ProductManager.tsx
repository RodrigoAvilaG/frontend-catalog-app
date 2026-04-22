import { useState, useEffect } from 'react';
import { 
  Box, Button, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface Product {
  id: string;
  name: string;
  price: string;
  stock: number;
}

export default function ProductManager({ token }: { token: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  
  // 🔥 Estados para el Modal y el Formulario
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    storeId: 'e37d398e-bfd9-4c18-861a-80d429e2bf4d' // 🛑 OJO: Lee la nota de abajo sobre esto
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || '', // Por si no tiene descripción
      price: product.price,
      stock: product.stock.toString(),
      storeId: formData.storeId // Mantenemos el ID de la tienda
    });
    setImageFile(null); // Limpiamos cualquier foto que se haya quedado pegada
    setOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', stock: '', storeId: formData.storeId });
    setImageFile(null);
    setOpen(true);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:3000/stores/soy-guapa');
      const data = await res.json();
      // Guardamos la tienda actual para poder usar su ID al crear productos
      setFormData(prev => ({ ...prev, storeId: data.id }));
      setProducts(data.products);
    } catch (error) {
      console.error("Error al cargar productos", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que quieres borrar este producto?')) return;
    try {
      const res = await fetch(`http://localhost:3000/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    if (formData.storeId) data.append('storeId', formData.storeId); 

    // Solo mandamos imagen si el usuario seleccionó una nueva
    if (imageFile) {
      data.append('image', imageFile);
    }

    // 🔥 LA MAGIA DE LA DECISIÓN:
    const url = editingId 
      ? `http://localhost:3000/products/${editingId}` // Modo Editar
      : 'http://localhost:3000/products';             // Modo Crear
      
    const method = editingId ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: data,
      });

      if (res.ok) {
        setOpen(false);
        setImageFile(null);
        setEditingId(null);
        setFormData({ ...formData, name: '', description: '', price: '', stock: '' });
        fetchProducts(); 
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error al guardar", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Catálogo de Productos</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleOpenCreate} // Abrimos el modal
        >
          Nuevo Producto
        </Button>
      </Box>

      {/* --- LA TABLA DE PRODUCTOS --- */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Precio</strong></TableCell>
              <TableCell><strong>Stock</strong></TableCell>
              <TableCell align="right"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenEdit(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- EL MODAL PARA CREAR PRODUCTOS --- */}
      <Dialog open={open} onClose={() => !isSubmitting && setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Editar Producto' : 'Agregar Nuevo Producto'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField fullWidth label="Nombre" margin="normal" required
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
            />
            <TextField fullWidth label="Descripción" margin="normal" multiline rows={3} required
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField fullWidth label="Precio" type="number" margin="normal" required
                value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} 
              />
              <TextField fullWidth label="Stock" type="number" margin="normal" required
                value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} 
              />
            </Box>
            
            {/* Botón para subir la imagen */}
            <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ mt: 2 }} fullWidth>
              {imageFile ? imageFile.name : 'Subir Imagen (Opcional)'}
              <input type="file" hidden accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
            </Button>

          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="inherit" disabled={isSubmitting}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : 'Guardar Producto'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}