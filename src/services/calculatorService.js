const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Calculator API functions
export const calculatorService = {
  // Get user's calculators
  getUserCalculators: async () => {
    const response = await fetch(`${API_BASE_URL}/calculators`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },

  // Create new calculator
  createCalculator: async (calculatorData) => {
    const response = await fetch(`${API_BASE_URL}/calculators`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(calculatorData)
    });
    return response.json();
  },

  // Update calculator
  updateCalculator: async (calculatorId, updateData) => {
    const response = await fetch(`${API_BASE_URL}/calculators/${calculatorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updateData)
    });
    return response.json();
  },

  // Delete calculator
  deleteCalculator: async (calculatorId) => {
    const response = await fetch(`${API_BASE_URL}/calculators/${calculatorId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },

  // Perform basic calculation
  performBasicCalculation: async (calculationData) => {
    const response = await fetch(`${API_BASE_URL}/calculators/calculate/basic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(calculationData)
    });
    return response.json();
  },

  // Get calculation history
  getCalculationHistory: async (calculatorId, page = 1, limit = 20) => {
    const response = await fetch(`${API_BASE_URL}/calculators/${calculatorId}/history?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }
};

export default calculatorService;
