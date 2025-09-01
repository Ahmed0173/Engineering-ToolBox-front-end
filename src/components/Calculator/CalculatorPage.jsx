import React, { useState, useEffect } from 'react';
import BasicCalculator from './BasicCalculator';
import FormulaCalculator from './FormulaCalculator';
import './CalculatorPage.scss';

const CalculatorPage = () => {
    const [calculatorType, setCalculatorType] = useState('BASIC');
    const [calculators, setCalculators] = useState([]);
    const [currentCalculator, setCurrentCalculator] = useState(null);
    const [loading, setLoading] = useState(false);

    // calculator functions (fetch, create, select, update) would go here
};

export default CalculatorPage;
