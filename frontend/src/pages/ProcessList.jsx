// src/pages/ProcessList.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

const ProcessList = () => {
  const [processos, setProcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProcessos = async () => {
      try {
        const response = await api.get('/processos/');
        setProcessos(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar processos:', err);
        setError('Falha ao carregar os processos. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchProcessos();
  }, []);

  if (loading) return <div className="text-center py-10">Carregando processos...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Processos</h1>
      
      {processos.length === 0 ? (
        <p className="text-gray-500">Nenhum processo encontrado.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {processos.map(processo => (
            <div 
              key={processo.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="font-bold text-lg">{processo.numero || "Sem número"}</h2>
              <p className="text-sm text-gray-500">{processo.tipo_processo.nome}</p>
              <p className="mt-2 truncate">{processo.objeto}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {processo.situacao.nome}
                </span>
                <a 
                  href={`/processos/${processo.id}`} 
                  className="text-blue-500 hover:underline"
                >
                  Ver detalhes
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProcessList;
