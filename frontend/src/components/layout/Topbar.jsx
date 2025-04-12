import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';

const Topbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const startContent = (
    <div className="flex align-items-center">
      <Button 
        icon="pi pi-bars" 
        onClick={toggleSidebar} 
        text 
        rounded 
        aria-label="Menu"
      />
      <h2 className="ml-3 my-0">Sistema Integrado de Gestão de Órgãos de Controle</h2>
    </div>
  );

  const endContent = (
    <div className="flex align-items-center">
      <span className="mr-2">Administrador</span>
      <Avatar icon="pi pi-user" shape="circle" />
      <Button 
        icon="pi pi-power-off" 
        className="ml-3" 
        text 
        rounded 
        tooltip="Sair" 
        tooltipOptions={{ position: 'bottom' }}
        onClick={handleLogout}
        aria-label="Logout"
      />
    </div>
  );

  return (
    <Toolbar 
      start={startContent} 
      end={endContent} 
      style={{ padding: '1rem', borderBottom: '1px solid var(--surface-border)' }}
    />
  );
};

export default Topbar;
