// src/pages/dashboard/history/History.jsx
import React from 'react';

const History = ({ history }) => {
  const getScoreClass = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="history-list">
      <div className="history-header">
        <span><i className="fas fa-clock-rotate-left"></i> Recent Scans</span>
        <span className="history-count">{history?.length || 0} scans</span>
      </div>
      {history && history.length > 0 ? (
        history.slice(0, 5).map((item) => (
          <div className="history-item" key={item.id}>
            <span className="site">
              <i className="fas fa-circle" style={{ 
                color: item.score >= 80 ? '#1e7b4c' : item.score >= 60 ? '#b9692b' : '#b34033',
                fontSize: '0.4rem',
                marginRight: '8px' 
              }}></i>
              {item.url}
            </span>
            <span className="date">{item.date}</span>
            <span className={`score ${getScoreClass(item.score)}`}>{item.score}</span>
          </div>
        ))
      ) : (
        <div className="history-empty">
          <p>No scans yet. Run your first scan above!</p>
        </div>
      )}
      {history && history.length > 5 && (
        <div style={{ textAlign: 'center', padding: '0.5rem 0', borderTop: '1px solid #edf2f7' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)' }}>
            + {history.length - 5} more scans
          </span>
        </div>
      )}
    </div>
  );
};

export default History;