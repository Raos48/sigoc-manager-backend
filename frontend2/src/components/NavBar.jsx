// src/components/NavBar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';



const NavBar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav>
      <div className="logo">
        <Link to="/">Sistema de Processos</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        
        {currentUser ? (
          <>
            <span>Olá, {currentUser.username || 'Usuário'}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
