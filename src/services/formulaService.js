// src/services/formulaService.js
const API_ROOT = (import.meta.env.VITE_BACK_END_SERVER_URL || 'http://localhost:3000').replace(/\/+$/, '');
const BASE_URL  = `${API_ROOT}/formulas`; // <-- single /formulas

export const formulaService = {
  // GET /formulas?category=&difficulty=&search=&page=&limit=
  getFormulas: async (filters = {}) => {
    const qs = new URLSearchParams();
    if (filters.category)   qs.append('category', filters.category);
    if (filters.difficulty) qs.append('difficulty', filters.difficulty);
    if (filters.search)     qs.append('search', filters.search);
    if (filters.page)       qs.append('page', filters.page);
    if (filters.limit)      qs.append('limit', filters.limit);

    const res = await fetch(`${BASE_URL}?${qs.toString()}`);
    if (!res.ok) throw new Error(`GET formulas failed: ${res.status}`);
    return res.json();
  },

  // GET /formulas/:id
  getFormulaById: async (formulaId) => {
    const res = await fetch(`${BASE_URL}/${formulaId}`);
    if (!res.ok) throw new Error(`GET formula failed: ${res.status}`);
    return res.json();
  },

  // GET /formulas/category/:category  (only if your backend supports it)
  getFormulasByCategory: async (category) => {
    const res = await fetch(`${BASE_URL}/category/${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error(`GET formulas by category failed: ${res.status}`);
    return res.json();
  },

  // GET /formulas/:id/calculation-options
  getFormulaCalculationOptions: async (formulaId) => {
    const res = await fetch(`${BASE_URL}/${formulaId}/calculation-options`);
    if (!res.ok) throw new Error(`GET options failed: ${res.status}`);
    return res.json();
  },

  // POST /formulas/calculate
  performFormulaCalculation: async (calculationData) => {
    const res = await fetch(`${BASE_URL}/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify(calculationData),
    });
    if (!res.ok) throw new Error(`Calculate failed: ${res.status}`);
    return res.json();
  },

  // helper
  searchFormulas: async (searchTerm, filters = {}) => {
    return formulaService.getFormulas({ ...filters, search: searchTerm });
  },
};

export default formulaService;
