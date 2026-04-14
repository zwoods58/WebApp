// Test script for Kyshi API connection
const { kyshiApi } = require('./src/lib/kyshi.ts');

const testKyshiAPI = async () => {
  try {
    console.log('Testing Kyshi API connection...');
    
    const api = kyshiApi();
    const isConnected = await api.testConnection();
    
    console.log('Kyshi API connection result:', isConnected);
    
    if (isConnected) {
      console.log('Testing transaction verification...');
      const status = await api.getTransactionStatus('ad8e6b57-278c-4848-a3e9-9fe444542eff');
      console.log('Transaction status:', status);
    }
    
  } catch (error) {
    console.error('Kyshi API test failed:', error);
  }
};

testKyshiAPI();
