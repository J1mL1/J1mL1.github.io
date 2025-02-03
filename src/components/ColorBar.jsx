import React, { useEffect } from 'react';
import '../styles/colorbar.css';

const gradients = [
  {
    label: '默认',
    value: 'linear-gradient(45deg, rgb(var(--accent)), #da62c4 30%, white 60%)',
    accent: '124, 58, 237',
    darkValue: 'linear-gradient(45deg, rgb(var(--accent)), #da62c4 30%, #2a2a2a 60%)'
  },
  {
    label: '蓝色',
    value: 'linear-gradient(45deg, #00b4d8, #48cae4 30%, white 60%)',
    accent: '0, 180, 216',
    darkValue: 'linear-gradient(45deg, #00b4d8, #48cae4 30%, #2a2a2a 60%)'
  },
  {
    label: '绿色',
    value: 'linear-gradient(45deg, #16a34a, #4ade80 30%, white 60%)',
    accent: '22, 163, 74',
    darkValue: 'linear-gradient(45deg, #16a34a, #4ade80 30%, #2a2a2a 60%)'
  }
];

export default function ColorBar() {
  useEffect(() => {
    const storedGradient = localStorage.getItem('accent-gradient');
    const storedAccent = localStorage.getItem('accent');
    const storedDarkGradient = localStorage.getItem('accent-gradient-dark');
    if (storedGradient) {
      document.documentElement.style.setProperty('--accent-gradient', storedGradient);
    }
    if (storedAccent) {
      document.documentElement.style.setProperty('--accent', storedAccent);
    }
    if (storedDarkGradient) {
      document.documentElement.style.setProperty('--accent-gradient-dark', storedDarkGradient);
    }
  }, []);

  const handleClick = (gradient, accent, darkGradient) => {
    console.log(`Clicked: ${gradient}`);
    localStorage.setItem('accent-gradient', gradient);
    localStorage.setItem('accent', accent);
    localStorage.setItem('accent-gradient-dark', darkGradient);
    document.documentElement.style.setProperty('--accent-gradient', gradient);
    document.documentElement.style.setProperty('--accent', accent);
    document.documentElement.style.setProperty('--accent-gradient-dark', darkGradient);
  };

  return (
    <div className="colorbar-container">
      <div className="colorbar">
        {gradients.map(({ label, value, accent, darkValue }) => (
          <button
            key={label}
            className="color-circle"
            style={{ background: value }}
            onClick={() => handleClick(value, accent, darkValue)}
            title={label}
          />
        ))}
      </div>
    </div>
  );
}
