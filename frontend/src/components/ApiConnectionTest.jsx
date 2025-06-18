import React, { useState, useEffect } from 'react';
import { testConnection } from '../services/api';

const ApiConnectionTest = () => {
  const [status, setStatus] = useState('Checking API connection...');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        setIsLoading(true);
        const result = await testConnection();
        setStatus(`API Connection Successful: ${JSON.stringify(result)}`);
        setError(null);
      } catch (err) {
        setStatus('API Connection Failed');
        setError(err.message || 'Unknown error occurred');
        console.error('API Connection Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkApiConnection();
  }, []);

  const testApiEndpoint = async (endpoint) => {
    try {
      const response = await fetch(`http://localhost:8000/api/${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      return {
        status: response.status,
        data
      };
    } catch (err) {
      console.error(`Error testing ${endpoint}:`, err);
      return {
        status: 'error',
        error: err.message
      };
    }
  };

  const handleTestDebugEndpoint = async () => {
    const result = await testApiEndpoint('debug');
    alert(`Debug Endpoint Result: ${JSON.stringify(result, null, 2)}`);
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      margin: '20px',
      backgroundColor: '#f9f9f9' 
    }}>
      <h2>API Connection Test</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <h3>API Status</h3>
        <p style={{ color: isLoading ? 'blue' : error ? 'red' : 'green' }}>
          {status}
        </p>
        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            <h4>Error Details:</h4>
            <p>{error}</p>
          </div>
        )}
      </div>
      
      <div>
        <h3>API Debug Endpoint</h3>
        <button 
          onClick={handleTestDebugEndpoint}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4a6cf7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test Debug Endpoint
        </button>
      </div>
    </div>
  );
};

export default ApiConnectionTest;
