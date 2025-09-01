const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Formula API functions
export const formulaService = {
  // Get all formulas with filtering
  getFormulas: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const response = await fetch(`${API_BASE_URL}/formulas?${queryParams}`);
    return response.json();
  },

  // Get formula by ID
  getFormulaById: async (formulaId) => {
    const response = await fetch(`${API_BASE_URL}/formulas/${formulaId}`);
    return response.json();
  },

  // Get formulas by category
  getFormulasByCategory: async (category) => {
    const response = await fetch(`${API_BASE_URL}/formulas/category/${category}`);
    return response.json();
  },

  // Get calculation options for a formula
  getFormulaCalculationOptions: async (formulaId) => {
    const response = await fetch(`${API_BASE_URL}/formulas/${formulaId}/calculation-options`);
    return response.json();
  },

  // Perform formula calculation
  performFormulaCalculation: async (calculationData) => {
    const response = await fetch(`${API_BASE_URL}/formulas/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(calculationData)
    });
    return response.json();
  },

  // Search formulas
  searchFormulas: async (searchTerm, filters = {}) => {
    const queryParams = new URLSearchParams({
      search: searchTerm,
      ...filters
    });

    const response = await fetch(`${API_BASE_URL}/formulas?${queryParams}`);
    return response.json();
  }
};

export default formulaService;
