import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearError } from '../store/pollSlice';

const Toast = () => {
  const error = useSelector((state) => state.poll.error);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000); // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  if (!error) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        background: '#FEE2E2',
        color: '#DC2626',
        fontFamily: 'Sora, sans-serif',
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '400px',
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
          stroke="#DC2626"
          strokeWidth="2"
        />
        <path
          d="M10 6V10M10 14H10.01"
          stroke="#DC2626"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span>{error}</span>
      <button
        onClick={() => dispatch(clearError())}
        style={{
          background: 'none',
          border: 'none',
          color: '#DC2626',
          cursor: 'pointer',
          fontSize: '20px',
          lineHeight: '1',
          padding: '0',
          marginLeft: 'auto',
        }}
      >
        ×
      </button>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;

