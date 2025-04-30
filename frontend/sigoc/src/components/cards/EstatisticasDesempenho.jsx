// src/components/dashboard/EstatisticasDesempenho.jsx
import React from 'react';
import { Card, CardHeader, Divider, CardContent, Grid, Paper, Typography, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function EstatisticasDesempenho() {
    return (
        <Card>
            <CardHeader
                title="Estatísticas"
                titleTypographyProps={{ variant: 'h6' }}
            />
            <Divider />
            <CardContent>
                <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                >
                    <Grid item xs={12} sm={2.8}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                textAlign: 'center',
                                bgcolor: (theme) => theme.palette.success.light + '15',
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 3,
                                    bgcolor: (theme) => theme.palette.success.light + '30'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                            </Box>
                            <Typography variant="h4" color="success.main">92%</Typography>
                            <Typography variant="body2" color="text.secondary">Taxa de Resolução</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={2.8}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                textAlign: 'center',
                                bgcolor: (theme) => theme.palette.primary.light + '15',
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 3,
                                    bgcolor: (theme) => theme.palette.primary.light + '30'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                <AccessTimeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                            </Box>
                            <Typography variant="h4" color="primary">15</Typography>
                            <Typography variant="body2" color="text.secondary">Tempo Médio (dias)</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={2.8}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                textAlign: 'center',
                                bgcolor: (theme) => theme.palette.info.light + '15',
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 3,
                                    bgcolor: (theme) => theme.palette.info.light + '30'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                <TrendingUpIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                            </Box>
                            <Typography variant="h4" color="info.main">85%</Typography>
                            <Typography variant="body2" color="text.secondary">Taxa de Crescimento</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={2.8}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                textAlign: 'center',
                                bgcolor: (theme) => theme.palette.secondary.light + '15',
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 3,
                                    bgcolor: (theme) => theme.palette.secondary.light + '30'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                <DoneAllIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                            </Box>
                            <Typography variant="h4" color="secondary.main">67</Typography>
                            <Typography variant="body2" color="text.secondary">Concluídos no Mês</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={2.8}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                textAlign: 'center',
                                bgcolor: (theme) => theme.palette.warning.light + '15',
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 3,
                                    bgcolor: (theme) => theme.palette.warning.light + '30'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                <AddCircleOutlineIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                            </Box>
                            <Typography variant="h4" color="warning.main">23</Typography>
                            <Typography variant="body2" color="text.secondary">Novos no Mês</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
