import React, { useState, useEffect } from 'react';
import './BasicCalculator.scss';

const BasicCalculator = ({ calculatorId, settings, onCalculation }) => {
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState(null);
    const [operation, setOperation] = useState(null);
    const [waitingForNewValue, setWaitingForNewValue] = useState(false);
    const [history, setHistory] = useState([]);
    const [expression, setExpression] = useState('');

    // Handle number input
    const inputNumber = (num) => {
        if (waitingForNewValue) {
            setDisplay(String(num));
            setWaitingForNewValue(false);
        } else {
            setDisplay(display === '0' ? String(num) : display + num);
        }
    };

    // Handle decimal point
    const inputDecimal = () => {
        if (waitingForNewValue) {
            setDisplay('0.');
            setWaitingForNewValue(false);
        } else if (display.indexOf('.') === -1) {
            setDisplay(display + '.');
        }
    };

    // Clear display
    const clear = () => {
        setDisplay('0');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForNewValue(false);
        setExpression('');
    };

    // Clear entry
    const clearEntry = () => {
        setDisplay('0');
    };

    // Handle operations
    const performOperation = (nextOperation) => {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(inputValue);
            setExpression(display + ' ' + nextOperation + ' ');
        } else if (operation) {
            const currentValue = previousValue || 0;
            const newValue = calculate(currentValue, inputValue, operation);

            setDisplay(String(newValue));
            setPreviousValue(newValue);
            setExpression(expression + display + ' ' + nextOperation + ' ');
        }

        setWaitingForNewValue(true);
        setOperation(nextOperation);
    };

    // Calculate result
    const calculate = (firstValue, secondValue, operation) => {
        switch (operation) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '×':
                return firstValue * secondValue;
            case '÷':
                return secondValue !== 0 ? firstValue / secondValue : 0;
            case '%':
                return firstValue % secondValue;
            default:
                return secondValue;
        }
    };

    // Handle equals
    const performCalculation = () => {
        const inputValue = parseFloat(display);

        if (previousValue !== null && operation) {
            const newValue = calculate(previousValue, inputValue, operation);
            const newExpression = expression + display + ' = ' + newValue;

            setDisplay(String(newValue));
            setHistory([...history, newExpression]);
            setPreviousValue(null);
            setOperation(null);
            setWaitingForNewValue(true);
            setExpression('');

            // Call onCalculation callback if provided
            if (onCalculation) {
                onCalculation({
                    expression: newExpression,
                    result: newValue,
                    timestamp: new Date().toISOString()
                });
            }
        }
    };

    // Handle backspace
    const backspace = () => {
        if (display.length > 1) {
            setDisplay(display.slice(0, -1));
        } else {
            setDisplay('0');
        }
    };

    // Handle sign toggle
    const toggleSign = () => {
        if (display !== '0') {
            setDisplay(display.charAt(0) === '-' ? display.slice(1) : '-' + display);
        }
    };

    return (
        <div className="basic-calculator">
            <div className="calculator-container">
                <div className="calculator-header">
                    <h3>Basic Calculator</h3>
                </div>

                <div className="calculator-display">
                    <div className="expression">{expression}</div>
                    <div className="current-value">{display}</div>
                </div>

                <div className="calculator-buttons">
                    <div className="button-row">
                        <button className="btn btn-function" onClick={clear}>C</button>
                        <button className="btn btn-function" onClick={clearEntry}>CE</button>
                        <button className="btn btn-function" onClick={backspace}>⌫</button>
                        <button className="btn btn-operator" onClick={() => performOperation('÷')}>÷</button>
                    </div>

                    <div className="button-row">
                        <button className="btn btn-number" onClick={() => inputNumber(7)}>7</button>
                        <button className="btn btn-number" onClick={() => inputNumber(8)}>8</button>
                        <button className="btn btn-number" onClick={() => inputNumber(9)}>9</button>
                        <button className="btn btn-operator" onClick={() => performOperation('×')}>×</button>
                    </div>

                    <div className="button-row">
                        <button className="btn btn-number" onClick={() => inputNumber(4)}>4</button>
                        <button className="btn btn-number" onClick={() => inputNumber(5)}>5</button>
                        <button className="btn btn-number" onClick={() => inputNumber(6)}>6</button>
                        <button className="btn btn-operator" onClick={() => performOperation('-')}>-</button>
                    </div>

                    <div className="button-row">
                        <button className="btn btn-number" onClick={() => inputNumber(1)}>1</button>
                        <button className="btn btn-number" onClick={() => inputNumber(2)}>2</button>
                        <button className="btn btn-number" onClick={() => inputNumber(3)}>3</button>
                        <button className="btn btn-operator" onClick={() => performOperation('+')}>+</button>
                    </div>

                    <div className="button-row">
                        <button className="btn btn-function" onClick={toggleSign}>±</button>
                        <button className="btn btn-number" onClick={() => inputNumber(0)}>0</button>
                        <button className="btn btn-function" onClick={inputDecimal}>.</button>
                        <button className="btn btn-equals" onClick={performCalculation}>=</button>
                    </div>
                </div>

                {history.length > 0 && (
                    <div className="calculator-history">
                        <h4>History</h4>
                        <div className="history-list">
                            {history.slice(-5).map((calc, index) => (
                                <div key={index} className="history-item">
                                    {calc}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BasicCalculator;
