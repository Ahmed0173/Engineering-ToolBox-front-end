import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BasicCalculator from './BasicCalculator';
import FormulaCalculator from './FormulaCalculator';
import './CalculatorPage.scss';

const CalculatorPage = () => {
    const [searchParams] = useSearchParams();
    const [calculatorType, setCalculatorType] = useState('BASIC');
    const [calculators, setCalculators] = useState([]);
    const [currentCalculator, setCurrentCalculator] = useState(null);
    const [loading, setLoading] = useState(false);

    // Check URL parameters on component mount
    useEffect(() => {
        const typeParam = searchParams.get('type');
        if (typeParam === 'formula') {
            setCalculatorType('FORMULA');
        } else if (typeParam === 'basic') {
            setCalculatorType('BASIC');
        }
    }, [searchParams]);

    const handleCalculatorTypeChange = (type) => {
        setCalculatorType(type);
    };

    const handleCalculation = (calculationData) => {
        console.log('Calculation performed:', calculationData);
    };

    return (
        <div className="calculator-page">
            <div className="calculator-header">
                <h1>Engineering Calculator</h1>
                <p>Choose between a basic calculator or advanced formula calculator for engineering calculations</p>
            </div>

            <div className="calculator-type-selector">
                <div className="selector-buttons">
                    <button
                        className={`type-btn ${calculatorType === 'BASIC' ? 'active' : ''}`}
                        onClick={() => handleCalculatorTypeChange('BASIC')}
                    >
                        <span className="btn-icon">🔢</span>
                        <div className="btn-text">
                            <h3>Basic Calculator</h3>
                        </div>
                    </button>

                    <button
                        className={`type-btn ${calculatorType === 'FORMULA' ? 'active' : ''}`}
                        onClick={() => handleCalculatorTypeChange('FORMULA')}
                    >
                        <span className="btn-icon">⚡</span>
                        <div className="btn-text">
                            <h3>Formula Calculator</h3>
                        </div>
                    </button>
                </div>
            </div>

            <div className="calculator-content">
                {calculatorType === 'BASIC' && (
                    <BasicCalculator
                        calculatorId="basic-calc"
                        settings={{}}
                        onCalculation={handleCalculation}
                    />
                )}

                {calculatorType === 'FORMULA' && (
                    <FormulaCalculator
                        calculatorId="formula-calc"
                        onCalculation={handleCalculation}
                    />
                )}
            </div>
        </div>
    );
};

export default CalculatorPage;
