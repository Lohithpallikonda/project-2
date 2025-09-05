import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard({ user, onLogout }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    setError('');
    
    try {
      await axios.post('/auth/logout', {}, {
        withCredentials: true
      });
      
      onLogout();
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Logout failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="loading-spinner">
        <p>Access denied. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p style={{ color: '#8b949e', fontSize: '18px' }}>
          Welcome back, {user.email.split('@')[0]}! 👋
        </p>
      </div>

      <div className="dashboard-card user-info-card">
        <h3 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '20px' }}>
          📊 Account Information
        </h3>
        
        <div className="user-info-item">
          <span className="user-info-label">Email Address</span>
          <span className="user-info-value">{user.email}</span>
        </div>
        
        <div className="user-info-item">
          <span className="user-info-label">User ID</span>
          <span className="user-info-value">#{user.id}</span>
        </div>
        
        <div className="user-info-item">
          <span className="user-info-label">Account Created</span>
          <span className="user-info-value">
            {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'N/A'}
          </span>
        </div>
        
        <div className="user-info-item">
          <span className="user-info-label">Status</span>
          <span className="user-info-value">
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: '#238636' 
              }}></span>
              Active
            </span>
          </span>
        </div>
      </div>

      <div className="dashboard-card success-card">
        <h3 style={{ color: '#ffffff', marginBottom: '16px', fontSize: '20px' }}>
          🎉 Authentication Successful!
        </h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.5' }}>
          You have successfully logged in and your session is active. This is a protected route that only authenticated users can access. Your session will persist across browser refreshes until you log out.
        </p>
      </div>

      <div className="dashboard-card">
        <h3 style={{ color: '#f0f6fc', marginBottom: '16px', fontSize: '20px' }}>
          🚀 Quick Actions
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div style={{ 
            padding: '16px', 
            background: '#0d1117', 
            borderRadius: '8px', 
            border: '1px solid #30363d' 
          }}>
            <h4 style={{ color: '#58a6ff', marginBottom: '8px', fontSize: '16px' }}>
              Session Management
            </h4>
            <p style={{ color: '#8b949e', fontSize: '14px', marginBottom: '12px' }}>
              Manage your current session and account security
            </p>
            {error && (
              <div className="error-message" style={{ marginBottom: '12px' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                </svg>
                {error}
              </div>
            )}
            <button 
              onClick={handleLogout}
              disabled={loading}
              className="btn btn-danger"
              style={{ width: 'auto', padding: '8px 16px' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing out...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '6px' }}>
                    <path d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                    <path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                  </svg>
                  Sign out
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;