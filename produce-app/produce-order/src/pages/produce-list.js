import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import Navbar from '../components/Navbar';
import ApiTest from '../components/ApiTest';

const ProduceList = () => {
  const [userCurrentOrder, setUserCurrentOrder] = useState([]);
  const [orderSnapshot, setOrderSnapshot] = useState(null);
  const [error, setError] = useState(null);
  const [submitButton, setSubmitButton] = useState(true);
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);

  const getTotalQuantity = () => {
    return userCurrentOrder.reduce((total, item) => total + parseInt(item.Qty || 0), 0);
  };

  const getTotal = () => {
    return userCurrentOrder.reduce((total, item) => {
      const price = item.promo_price > 0 ? item.promo_price : item.case_cost;
      return total + (price * parseInt(item.Qty || 0));
    }, 0).toFixed(2);
  };

  const handleConfirmOrder = () => {
    setOrderSnapshot([...userCurrentOrder]);
    submitOrder();
  };

  const submitOrder = async () => {
    try {
      // First test if we can reach the backend
      console.log('Testing backend connection...');
      const testResponse = await fetch('http://127.0.0.1:8000/api/test', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const testData = await testResponse.json();
      console.log('Test response:', testData);

      if (!userCurrentOrder || userCurrentOrder.length === 0) {
        setError('Cannot submit empty order');
        return;
      }

      const items = userCurrentOrder.map(item => ({
        name: item.name,
        quantity: parseInt(item.Qty),
        case_cost: parseFloat(item.promo_price > 0 ? item.promo_price : item.case_cost),
        total: parseFloat(item.Qty * (item.promo_price > 0 ? item.promo_price : item.case_cost))
      }));

      console.log('Sending order data:', { items });

      const response = await fetch('http://127.0.0.1:8000/api/send-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ items })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.message || 'Server error');
      }

      const data = await response.json();
      console.log('Server response:', data);

      if (data.message === 'Order sent successfully!') {
        setError(null);
        toggleSubmitButton();
        clearOrder();
        updateCurrentBalance([]);
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      setError(error.message || 'Failed to send order');
      toggleSubmitButton();
    }
  };

  const toggleSubmitButton = () => {
    setSubmitButton(!submitButton);
  };

  const toggleSubmitButtonClicked = () => {
    setSubmitButtonClicked(!submitButtonClicked);
  };

  const clearOrder = () => {
    setUserCurrentOrder([]);
  };

  const updateCurrentBalance = (newOrder) => {
    setUserCurrentOrder(newOrder);
  };

  useEffect(() => {
    console.log('Order state changed:', userCurrentOrder);
  }, [userCurrentOrder]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Confirm Your Order" />
      <ApiTest />
      
      <Button
        variant="contained"
        onClick={handleConfirmOrder}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        Submit Order
      </Button>
    </div>
  );
};

export default ProduceList; 