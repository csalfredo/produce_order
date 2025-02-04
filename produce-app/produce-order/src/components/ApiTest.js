import React, { useEffect, useState } from 'react';

const ApiTest = () => {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testing API connection...');
        const response = await fetch('http://127.0.0.1:8000/api/test');
        console.log('Raw response:', response);
        
        const data = await response.json();
        console.log('API response:', data);
        
        setStatus('API is working');
      } catch (error) {
        console.error('API test failed:', error);
        setStatus('API connection failed: ' + error.message);
      }
    };

    testApi();
  }, []);

  return (
    <div style={{ padding: '10px', background: '#f0f0f0', margin: '10px' }}>
      API Status: {status}
    </div>
  );
};

export default ApiTest; 