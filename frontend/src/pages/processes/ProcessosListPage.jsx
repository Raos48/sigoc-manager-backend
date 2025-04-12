import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';

const ProcessosListPage = () => {
  const [processos, setProcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          numero: '2025/00001',
          tipo: 'Auditoria',
          situacao: 'Em andamento',
          unidade: 'Secretaria de Finanças',
          auditor: 'João Silva',
          dataInicio: '2025-01-10',
          dataFim: '2025-04-30'
        },
        {
          id: 2,
          numero: '2025/00002',
          tipo: 'Inspeção',
          situacao: 'Concluído',
          unidade: 'Secretaria de Educação',
          auditor: 'Maria Santos',
          dataInicio: '2025-02-15',
          dataFim: '2025-03-15'
        },
        {
          id: 3,
          numero: '2025/00003',
          tipo: 'Monitoramento',
          situacao: 'Planejado',
          unidade: 'Secretaria de Saúde',
          auditor: 'Carlos Ferreira',
          dataInicio: '2025-05-01',
          dataFim: null
        },
        {
          id: 4,
          numero: '2025/00004',
          tipo: 'Auditoria',
          situacao: 'Em andamento',
          unidade: 'Secretaria de Infraestrutura',
          auditor: 'Ana Costa',
          dataInicio: '2025-03-10',
          dataFim: '2025-06-30'
        },
        {
          id: 5,
          numero: '2025/00005',
          tipo: 'Inspeção',
          situacao: 'Em andamento',
          unidade: 'Secretaria de Transportes',
          auditor: 'Paulo Oliveira',
          dataInicio: '2025-04-01',
          dataFim: '2025-05-15'
        }
      ];
      setProcessos(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const acoesBodyTemplate = (rowData) => {
    return (

      <div className="flex">

        {rowData.situacao}

        
         <Button 
          icon="pi pi-eye" 
          rounded 
          text 
          severity="info" 
          className="mr-2" 
          tooltip="Visualizar" 
          tooltipOptions={{ position: 'top' }}
        />
        <Button 
          icon="pi pi-pencil" 
          rounded 
          text 
          severity="success" 
          className="mr-2" 
          tooltip="Editar" 
          tooltipOptions={{ position: 'top' }}
        />
        <Button 
          icon="pi pi-trash" 
          rounded 
          text 
          severity="danger" 
          tooltip="Excluir" 
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    );
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const dataInicioBodyTemplate = (rowData) => {
    return formatDate(rowData.dataInicio);
  };

  const dataFimBodyTemplate = (rowData) => {
    return formatDate(rowData.dataFim);
  };

  const situacaoBodyTemplate = (rowData) => {
    return (
      <span className={`status-badge status-${rowData.situacao.toLowerCase().replace(' ', '-')}`}>
        {rowData.situacao}
      </span>
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button 
          label="Novo Processo" 
          icon="pi pi-plus" 
          severity="success" 
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="flex align-items-center justify-content-end gap-2">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText 
            value={globalFilter} 
            onChange={(e) => setGlobalFilter(e.target.value)} 
            placeholder="Pesquisar..." 
          />
        </span>
      </div>
    );
  };

  return (
    <div>
      <div className="card">
        <h1>Processos</h1>
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
        
        <DataTable 
          value={processos} 
          paginator 
          rows={10} 
          rowsPerPageOptions={[5, 10, 25]} 
          dataKey="id" 
          rowHover 
          loading={loading}
          globalFilter={globalFilter}
          emptyMessage="Nenhum processo encontrado"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          className="p-datatable-gridlines"
        >
          <Column field="numero" header="Número" sortable style={{ minWidth: '12rem' }} />
          <Column field="tipo" header="Tipo" sortable style={{ minWidth: '10rem' }} />
          <Column field="situacao" header="Situação" body={situacaoBodyTemplate} sortable style={{ minWidth: '10rem' }} />
          <Column field="unidade" header="Unidade" sortable style={{ minWidth: '15rem' }} />
          <Column field="auditor" header="Auditor Responsável" sortable style={{ minWidth: '15rem' }} />
          <Column field="dataInicio" header="Data Início" body={dataInicioBodyTemplate} sortable style={{ minWidth: '10rem' }} />
          <Column field="dataFim" header="Data Fim" body={dataFimBodyTemplate} sortable style={{ minWidth: '10rem' }} />
          <Column body={acoesBodyTemplate} header="Ações" style={{ minWidth: '10rem', textAlign: 'center' }} />
        </DataTable>
      </div>
    </div>
  );
};

export default ProcessosListPage;
