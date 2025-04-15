import React from 'react';
import { Link } from 'react-router-dom';


const Header = () => {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <h1 style={logoStyle}>Task Manager</h1>
        <nav>
          {isLoggedIn ? (
            <button style={buttonStyle}
              onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" style={linkStyle}>Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

const headerStyle = {
  backgroundColor: '#333',
  color: 'white',
  padding: '1rem'
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '1200px',
  margin: '0 auto'
};

const logoStyle = {
  margin: 0,
  fontSize: '1.5rem'
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  backgroundColor: '#007bff'
};

const buttonStyle = {
  ...linkStyle,
  border: 'none',
  cursor: 'pointer'
};

export default Header;