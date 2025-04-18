import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AccountList.css';

// Icons for status badges
const StatusIcon = ({ status }) => {
  const getIcon = () => {
    switch (status) {
      case 'Target':
        return '🎯';
      case 'Prospect':
        return '🔍';
      case 'Customer':
        return '💼';
      case 'Archived':
        return '📁';
      default:
        return '❓';
    }
  };

  return <span className="status-icon">{getIcon()}</span>;
};

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/accounts', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAccounts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch accounts. Please try again later.');
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/accounts/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update local state
      setAccounts(accounts.map(account =>
        account.id === id ? { ...account, status } : account
      ));
    } catch (err) {
      setError('Failed to update status. Please try again.');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'high-score';
    if (score >= 70) return 'medium-score';
    return 'low-score';
  };

  if (loading) {
    return <div className="loading">Loading accounts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="account-list-container">
      <div className="account-header">
        <h2>Target Accounts</h2>
        <div className="account-stats">
          <div className="stat-box">
            <span className="stat-number">{accounts.length}</span>
            <span className="stat-label">Total Accounts</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{accounts.filter(a => a.status === 'Target').length}</span>
            <span className="stat-label">Targets</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">
              {Math.round(accounts.reduce((sum, account) => sum + account.matchScore, 0) / accounts.length || 0)}%
            </span>
            <span className="stat-label">Avg. Match Score</span>
          </div>
        </div>
      </div>

      <div className="account-cards">
        {accounts.map(account => (
          <div key={account.id} className={`account-card ${account.status.toLowerCase()}-card`}>
            <div className="card-header">
              <h3>{account.name}</h3>
              <div className={`match-score ${getScoreColor(account.matchScore)}`}>
                {account.matchScore}%
              </div>
            </div>

            <div className="card-body">
              <div className="status-badge">
                <StatusIcon status={account.status} />
                <span>{account.status}</span>
              </div>

              <div className="card-id">ID: {account.id}</div>
            </div>

            <div className="card-footer">
              <div className="status-actions">
                <button
                  className={`status-btn ${account.status === 'Target' ? 'active' : ''}`}
                  onClick={() => updateStatus(account.id, 'Target')}
                >
                  <span className="btn-icon">🎯</span> Target
                </button>
                <button
                  className={`status-btn ${account.status === 'Prospect' ? 'active' : ''}`}
                  onClick={() => updateStatus(account.id, 'Prospect')}
                >
                  <span className="btn-icon">🔍</span> Prospect
                </button>
                <button
                  className={`status-btn ${account.status === 'Customer' ? 'active' : ''}`}
                  onClick={() => updateStatus(account.id, 'Customer')}
                >
                  <span className="btn-icon">💼</span> Customer
                </button>
                <button
                  className={`status-btn ${account.status === 'Archived' ? 'active' : ''}`}
                  onClick={() => updateStatus(account.id, 'Archived')}
                >
                  <span className="btn-icon">📁</span> Archived
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountList;
