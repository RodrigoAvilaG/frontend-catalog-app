import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';

// Definimos qué propiedades recibe este componente
interface LoginProps {
    onLoginSuccess: (token: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Mandamos las credenciales al backend
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }

            // 🔥 LA MAGIA: Guardamos la pulsera VIP en la bóveda del navegador
            localStorage.setItem('token', data.token);

            // Le avisamos a nuestra App que ya tenemos el token
            onLoginSuccess(data.token);

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h5" component="h1" gutterBottom align="center">
                    Acceso Administrador
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth label="Correo Electrónico" variant="outlined" margin="normal"
                        value={email} onChange={(e) => setEmail(e.target.value)} required
                    />
                    <TextField
                        fullWidth label="Contraseña" type="password" variant="outlined" margin="normal"
                        value={password} onChange={(e) => setPassword(e.target.value)} required
                    />
                    <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                        Entrar al Backoffice
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}