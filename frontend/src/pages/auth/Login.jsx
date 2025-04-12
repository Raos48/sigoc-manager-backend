import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Como é apenas visual neste momento, vamos apenas redirecionar para a área principal
    navigate('/app');
  };

  return (
    <div className="login-container">
      <Card className="login-panel">
        <div className="login-logo">
          <h1>SIGOC</h1>
          <h3>Sistema Integrado de Gestão de Órgãos de Controle</h3>
        </div>
        <form onSubmit={handleLogin}>
          <div className="p-fluid">
            <div className="field">
              <label htmlFor="username" className="font-bold">Usuário</label>
              <InputText 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                autoFocus
                className="w-full"
              />
            </div>
            <div className="field">
              <label htmlFor="password" className="font-bold">Senha</label>
              <Password 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                feedback={false}
                toggleMask
                required
                className="w-full"
              />
            </div>
            <Divider />
            <Button 
              label="Entrar" 
              type="submit" 
              className="w-full"
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;
