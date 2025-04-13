// src/components/Home.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

const Home = () => {
  const [processos, setProcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProcessos = async () => {
      try {
        const response = await api.get('/processos/');
        setProcessos(response.data);
      } catch (err) {
        setError('Erro ao carregar os processos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessos();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h2>Processos</h2>
      {processos.length > 0 ? (
        <ul>
          {processos.map((processo) => (
            <li key={processo.id}>{processo.titulo || processo.nome || `Processo #${processo.id}`}</li>
          ))}
        </ul>
      ) : (
        <p>Nenhum processo encontrado.</p>
      )}
    </div>
  );
};

export default Home;
