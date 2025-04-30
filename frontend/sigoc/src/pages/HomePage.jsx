import React from 'react';
import { Box, Typography, Button, Paper, Grid, Card, CardContent, CardActions, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  ListAlt as ListAltIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import EstatisticasDesempenho from '/src/components/cards/EstatisticasDesempenho';


const GradientBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(6),
  color: 'white',
  textAlign: 'center',
  marginBottom: theme.spacing(4)
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8]
  }
}));

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ p: 3 }}>

      {/* <GradientBox>
        <Typography variant="h3" gutterBottom>
          Bem-vindo ao SIGOC
        </Typography>
        <Typography variant="h6">
          Sistema Integrado de Controle de Órgãos Externos
        </Typography>
      </GradientBox> */}
      
      {/* <Box sx={{ mb: 4 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          Olá, Visitante!
        </Typography>
        <Typography variant="body1" paragraph>
          Utilize o menu lateral para navegar entre as funcionalidades do sistema.
        </Typography>
      </Box> */}
      
      {/* <Typography variant="h5" color="primary" gutterBottom>
        Funcionalidades Disponíveis
      </Typography> */}


                        
      <EstatisticasDesempenho />
        
      
      <Grid container spacing={3} sx={{ mb: 4, mt: 4  }}>


        
        <Grid item xs={12} md={4}>
          <FeatureCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ListAltIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Processos
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Gerencie todos os processos do sistema. Visualize, filtre e pesquise
                processos por diferentes critérios como origem, tipo e vencimento.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={() => navigate('/processos')}>
                Gerenciar Processos
              </Button>
            </CardActions>
          </FeatureCard>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <FeatureCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AddIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Novo Processo
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Cadastre novos processos no sistema. Preencha informações como tipo,
                origem, vencimento e prioridade para manter o controle atualizado.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={() => navigate('/novo-processo')}>
                Cadastrar Processo
              </Button>
            </CardActions>
          </FeatureCard>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <FeatureCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SettingsIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Configurações
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Configure parâmetros do sistema, realize backups e gerencie
                as configurações avançadas do SIGOC.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={() => navigate('/configuracoes')}>
                Acessar Configurações
              </Button>
            </CardActions>
          </FeatureCard>
        </Grid>
      </Grid>
      
      <Divider sx={{ mb: 4 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Sobre o SIGOC
              </Typography>
              <Typography variant="body2" paragraph>
                O Sistema Integrado de Controle de Órgãos Externos (SIGOC) foi desenvolvido para facilitar
                o gerenciamento de processos internos da organização, especialmente aqueles relacionados
                a demandas de órgãos externos.
              </Typography>
              <Typography variant="body2" paragraph>
                Com uma interface intuitiva e funcionalidades completas, o SIGOC permite o cadastro,
                acompanhamento e análise de processos de forma eficiente e organizada.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Ajuda e Suporte
              </Typography>
              <Typography variant="body2" paragraph>
                Em caso de dúvidas ou problemas com o sistema, entre em contato com a equipe de suporte:
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> suporte@sigoc.gov.br
              </Typography>
              <Typography variant="body2">
                <strong>Telefone:</strong> (XX) XXXX-XXXX
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Horário de atendimento: Segunda a Sexta, das 8h às 18h xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
