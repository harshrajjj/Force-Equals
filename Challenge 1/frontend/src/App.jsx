import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AccountList from './components/AccountList';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Target Account Matching</h1>
        {isAuthenticated && (
          <button className="logout-btn" onClick={handleLogout}>
            <span>Sign Out</span>
          </button>
        )}
      </header>
      <main>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/accounts" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/accounts"
            element={isAuthenticated ? <AccountList /> : <Navigate to="/" />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
