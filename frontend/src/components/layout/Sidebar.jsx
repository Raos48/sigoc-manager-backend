import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'primereact/menu';

const Sidebar = ({ visible }) => {
  const navigate = useNavigate();
  

  const menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-home',
      command: () => navigate('/app/dashboard')
    },
    {
      label: 'Processos',
      icon: 'pi pi-fw pi-file',
      command: () => navigate('/app/processos')
    },
    {
      label: 'Reuniões',
      icon: 'pi pi-fw pi-calendar',
      command: () => navigate('/app/reunioes')
    },
    {
      label: 'Demandas',
      icon: 'pi pi-fw pi-list',
      command: () => navigate('/app/demandas')
    },
    {
      label: 'Auditores',
      icon: 'pi pi-fw pi-users',
      command: () => navigate('/app/auditores')
    },
    {
      label: 'Unidades',
      icon: 'pi pi-fw pi-building',
      command: () => navigate('/app/unidades')
    },
    {
      label: 'Configurações',
      icon: 'pi pi-fw pi-cog',
      command: () => navigate('/app/configuracoes')
    }
  ];

  return (
    <div className={`layout-sidebar ${visible ? '' : 'layout-sidebar-hidden'}`}>
      <div className="sidebar-header">
        <h2>SIGOC</h2>
      </div>
      <Menu model={menuItems} className="w-full" />
    </div>
  );
};

export default Sidebar;
