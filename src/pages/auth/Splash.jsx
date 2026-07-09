// src/pages/Splash.jsx
import React from 'react';

const Splash = ({ onGetStarted }) => {
  return (
    <>
      <style jsx>{`
        .splash-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          background: var(--bg-primary, #f9fcff);
          min-height: 80vh;
          max-width: 800px;
          margin: 0 auto;
        }

        .splash-page i {
          font-size: 6rem;
          color: var(--primary-dark, #0b2b4a);
          background: #e6effa;
          padding: 2rem;
          border-radius: 60px;
          margin-bottom: 2rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .splash-page i:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 32px rgba(11, 43, 74, 0.15);
        }

        .splash-page h1 {
          font-size: 3rem;
          font-weight: 800;
          color: var(--text-primary, #0b2b4a);
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .splash-page h1::after {
          content: '';
          display: block;
          width: 60px;
          height: 4px;
          background: var(--primary-color, #2d7aff);
          margin: 0.5rem auto 0;
          border-radius: 2px;
        }

        .splash-page p {
          font-size: 1.1rem;
          color: var(--text-muted, #64748b);
          max-width: 460px;
          line-height: 1.7;
          margin: 0.5rem auto 0;
        }

        .splash-page .btn-primary {
          background: var(--primary-dark, #0b2b4a);
          color: white;
          border: none;
          padding: 0.8rem 2.5rem;
          border-radius: 40px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
          box-shadow: 0 4px 16px rgba(11, 43, 74, 0.2);
        }

        .splash-page .btn-primary:hover {
          background: #1a3d5e;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(11, 43, 74, 0.3);
        }

        .splash-page .btn-primary:active {
          transform: translateY(0);
          box-shadow: 0 4px 12px rgba(11, 43, 74, 0.2);
        }

        .splash-page .btn-primary i {
          font-size: 1rem;
          padding: 0;
          background: none;
          margin: 0;
          transition: transform 0.3s ease;
        }

        .splash-page .btn-primary:hover i {
          transform: translateX(4px);
        }

        .splash-features {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem 2rem;
          margin-top: 2.5rem;
        }

        .splash-features span {
          font-size: 0.9rem;
          color: var(--text-secondary, #1e293b);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-secondary, #f1f5f9);
          padding: 0.4rem 1.2rem;
          border-radius: 40px;
          border: 1px solid var(--border-color, #e9eff5);
          transition: all 0.2s ease;
        }

        .splash-features span:hover {
          background: var(--bg-white, #ffffff);
          border-color: var(--primary-color, #2d7aff);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .splash-features i {
          font-size: 0.9rem;
          padding: 0;
          background: none;
          color: var(--success-color, #1e7b4c);
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .splash-page {
            padding: 3rem 1.5rem;
            min-height: 70vh;
          }

          .splash-page i {
            font-size: 4.5rem;
            padding: 1.5rem;
          }

          .splash-page h1 {
            font-size: 2.2rem;
          }

          .splash-page p {
            font-size: 1rem;
            padding: 0 0.5rem;
          }

          .splash-features {
            gap: 0.8rem 1.2rem;
          }

          .splash-features span {
            font-size: 0.8rem;
            padding: 0.3rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .splash-page {
            padding: 2rem 1rem;
            min-height: 60vh;
          }

          .splash-page i {
            font-size: 3.5rem;
            padding: 1.2rem;
            margin-bottom: 1.5rem;
          }

          .splash-page h1 {
            font-size: 1.8rem;
          }

          .splash-page h1::after {
            width: 40px;
            height: 3px;
          }

          .splash-page p {
            font-size: 0.9rem;
          }

          .splash-page .btn-primary {
            padding: 0.7rem 2rem;
            font-size: 0.9rem;
            width: 100%;
            justify-content: center;
          }

          .splash-features {
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            margin-top: 2rem;
          }

          .splash-features span {
            width: 100%;
            justify-content: center;
            font-size: 0.8rem;
            padding: 0.4rem 1rem;
          }
        }
      `}</style>

      <div className="splash-page">
        <i className="fas fa-shield-halved"></i>
        <h1>CyberInsight</h1>
        <p>Security intelligence for your websites. Analyze, understand, and improve your security posture.</p>
        <button className="btn-primary" onClick={onGetStarted}>
          Get Started <i className="fas fa-arrow-right"></i>
        </button>
        
      </div>
    </>
  );
};

export default Splash;