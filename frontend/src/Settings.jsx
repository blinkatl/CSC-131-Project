import React, { useEffect } from 'react';
import './Settings.css';

const Settings = () => {
  const changeFontSize = (multiplier) => {
    const root = document.documentElement;
    const currentSize = parseFloat(getComputedStyle(root).getPropertyValue('--font-size-base')) || 16;
    const newSize = currentSize * multiplier;
    root.style.setProperty('--font-size-base', `${newSize}px`);
  };

  const toggleHighContrast = () => {
    document.documentElement.classList.toggle('high-contrast');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey) {
        switch (e.key) {
          case '1':
            window.location.href = '/dashboard';
            break;
          case '2':
            window.location.href = '/books';
            break;
          case '3':
            window.location.href = '/membership';
            break;
          case '4':
            window.location.href = '/admin/dashboard';
            break;
          case '5':
            window.location.href = '/admin/books';
            break;
          case '6':
            window.location.href = '/admin/users';
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="settings-panel">
      <h2>Accessibility Settings</h2>

      <div className="setting-group">
        <h4>Font Size</h4>
        <button onClick={() => changeFontSize(1.1)} aria-label="Increase font size">A+</button>
        <button onClick={() => changeFontSize(0.9)} aria-label="Decrease font size">A-</button>
      </div>

      <div className="setting-group">
        <h4>Contrast</h4>
        <button onClick={toggleHighContrast} aria-label="Toggle high contrast mode">
          Toggle High Contrast
        </button>
      </div>

      <div className="setting-group">
        <h4>Keyboard Shortcuts (Alt + #)</h4>
        <ul>
          <li><b>Alt+1</b> → /dashboard</li>
          <li><b>Alt+2</b> → /books</li>
          <li><b>Alt+3</b> → /membership</li>
          <li><b>Alt+4</b> → /admin/dashboard</li>
          <li><b>Alt+5</b> → /admin/books</li>
          <li><b>Alt+6</b> → /admin/users</li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
