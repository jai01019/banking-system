import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BankerAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/accounts`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();

          // Ensure the response contains an 'accounts' array
          if (Array.isArray(data.accounts)) {
            setAccounts(data.accounts);
          } else {
            setError('Invalid data format received from the server');
          }
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch accounts');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError('An error occurred while fetching accounts');
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  if (loading) {
    return <p>Loading accounts...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={styles.container}>
      <h2>Banker Accounts</h2>
      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {accounts && accounts.length > 0 ? (
            accounts.map((account) => (
              <tr key={account.id}>
                <td>{account.id}</td>
                <td>
                  <button
                    onClick={() => navigate(`/transactions/${account.id}`)}
                    style={styles.viewButton}
                  >
                    {account.name}
                  </button>
                </td>
                <td>{account.email}</td>
                <td>{new Date(account.created_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No accounts found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  logoutButton: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  viewButton: {
    padding: '5px 10px',
    fontSize: '14px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default BankerAccounts;