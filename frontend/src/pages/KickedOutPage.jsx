import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPoll, setUserRole } from '../store/pollSlice';
import logoIcon from '../assets/logo.svg';

const KickedOutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Redirect to landing page after 5 seconds
    const timer = setTimeout(() => {
      dispatch(resetPoll());
      dispatch(setUserRole(null));
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, dispatch]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 py-12">
      {/* Badge */}
      <div 
        className="text-white text-sm font-medium flex items-center"
        style={{
          height: '31px',
          borderRadius: '24px',
          paddingLeft: '9px',
          paddingRight: '9px',
          gap: '7px',
          background: 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)',
          display: 'inline-flex',
          marginBottom: '60px',
        }}
      >
        <span>
          <img 
            src={logoIcon} 
            alt="Intervue Poll" 
            style={{
              width: '14.656015396118164px',
              height: '14.652154922485352px',
              opacity: 1,
            }}
          />
        </span>
        <span 
          style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '100%',
            color: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          Intervue Poll
        </span>
      </div>

      {/* Heading */}
      <h1 
        style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '36px',
          fontWeight: 700,
          color: '#000000',
          margin: 0,
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        You've been Kicked out!
      </h1>

      {/* Message */}
      <p 
        style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '16px',
          fontWeight: 400,
          color: '#6B7280',
          lineHeight: '1.5',
          margin: 0,
          textAlign: 'center',
          maxWidth: '600px',
        }}
      >
        Looks like the teacher had removed you from the poll system. Please
        <br />
        Try again sometime.
      </p>
    </div>
  );
};

export default KickedOutPage;

