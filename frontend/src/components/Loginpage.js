import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  // Function to handle navigation to the customer login page
  const handleCustomerLogin = () => {
    navigate('/customer-login');
  };

  // Function to handle navigation to the banker login page
  const handleBankerLogin = () => {
    navigate('/banker-login');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.welcomeMessage}>Welcome to Our Banking App</h1>
      <p style={styles.subMessage}>Please select your role to proceed:</p>

      <div style={styles.buttonsContainer}>
        <button onClick={handleCustomerLogin} style={styles.loginButton}>
          Login as Customer
        </button>
        <button onClick={handleBankerLogin} style={styles.loginButton}>
          Login as Banker
        </button>
      </div>
    </div>
  );
};

// Styles for the component
const styles = {
  container: {
    maxWidth: '400px',
    margin: '100px auto',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  welcomeMessage: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  subMessage: {
    fontSize: '16px',
    marginBottom: '30px',
    color: '#555',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  loginButton: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#0d6efd',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  loginButtonHover: {
    backgroundColor: '#0b5ed7',
  },
};

export default Login;