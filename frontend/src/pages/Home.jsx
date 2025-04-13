// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';

// MUI Components
import { Box, Typography, List, ListItem, ListItemText, Paper, Divider } from '@mui/material';

const Home = () => {
    const [processos, setProcessos] = useState([]);

    useEffect(() => {
        // Função assíncrona dentro do useEffect
        const fetchProcessos = async () => {
            try {
                const response = await api.get('/processos/');
                setProcessos(response.data.results);
            } catch (error) {
                console.error('Failed to fetch processos', error);
            }
        };

        fetchProcessos();
    }, []); // Array de dependências vazio para executar apenas uma vez

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Processos
            </Typography>
            <Paper variant="outlined">
                <List>
                    {processos.map((processo, index) => (
                        <div key={processo.id}>
                            <ListItem>
                                <ListItemText
                                    primary={`#${processo.id} - ${processo.assunto}`}
                                    secondary={`Criado em: ${new Date(processo.data_criacao).toLocaleDateString()}`}
                                />
                            </ListItem>
                            {index < processos.length - 1 && <Divider />}
                        </div>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default Home;