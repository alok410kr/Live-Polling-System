import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserRole, setStudentName } from '../store/pollSlice';
import logoIcon from '../assets/logo.svg';

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState('student');

  const handleContinue = () => {
    // Clear student name when selecting student role (ask for name every time)
    if (selectedRole === 'student') {
      dispatch(setStudentName(null));
    }
    dispatch(setUserRole(selectedRole));
    // Navigate to the appropriate route
    navigate(selectedRole === 'teacher' ? '/teacher' : '/student');
  };

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center px-8 py-12" style={{ overflow: 'hidden' }}>
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
          marginBottom: '24px',
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

      {/* Title Section */}
      <div 
        style={{
          width: '981px',
          height: '103px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '60px',
        }}
      >
        {/* Inner Box */}
        <div 
          style={{
            width: '737px',
            height: '103px',
            display: 'flex',
            flexDirection: 'column',
            gap: '26px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Title */}
          <h1 
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '36px',
              color: '#000000',
              textAlign: 'center',
              margin: 0,
            }}
          >
            <span style={{ fontWeight: 400 }}>Welcome to the </span>
            <span style={{ fontWeight: 700 }}>Live Polling System</span>
          </h1>

          {/* Description */}
          <p 
            style={{
              width: '737px',
              minHeight: '48px',
              fontFamily: 'Sora, sans-serif',
              fontWeight: 400,
              fontSize: '19px',
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'center',
              color: '#6B7280',
              margin: 0,
              wordWrap: 'break-word',
            }}
          >
            Please select the role that best describes you to begin using the live polling system
          </p>
        </div>
      </div>

      {/* Role Selection Cards */}
      <div 
        className="flex flex-wrap justify-center"
        style={{ marginBottom: '60px', gap: '40px', width: '100%', maxWidth: '1200px' }}
      >
        {/* Student Card */}
        <div
          className={`cursor-pointer transition-all relative ${selectedRole === 'student' ? 'selected-card' : ''}`}
          style={{
            width: '100%',
            maxWidth: '387px',
            minHeight: '120px',
            borderRadius: '10px',
            paddingTop: '15px',
            paddingRight: '17px',
            paddingBottom: '15px',
            paddingLeft: '25px',
            background: '#FFFFFF',
            border: selectedRole === 'student' 
              ? 'none'
              : '3px solid #E5E7EB',
            display: 'flex',
            flexDirection: 'column',
            gap: '17px',
            position: 'relative',
          }}
          onClick={() => setSelectedRole('student')}
        >
          {selectedRole === 'student' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '10px',
                padding: '3px',
                background: 'linear-gradient(92.24deg, #7765DA -8.5%, #1D68BD 101.3%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          )}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                color: '#000000',
                margin: 0,
              }}
            >
              I'm a Student
            </h2>
            <p 
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '16px',
                fontWeight: 400,
                color: '#6B7280',
                lineHeight: 'normal',
                margin: 0,
              }}
            >
              Join live polls, submit your answers, and see real-time results with your classmates.
            </p>
          </div>
        </div>

        {/* Teacher Card */}
        <div
          className={`cursor-pointer transition-all relative ${selectedRole === 'teacher' ? 'selected-card' : ''}`}
          style={{
            width: '100%',
            maxWidth: '387px',
            minHeight: '120px',
            borderRadius: '10px',
            paddingTop: '15px',
            paddingRight: '17px',
            paddingBottom: '15px',
            paddingLeft: '25px',
            background: '#FFFFFF',
            border: selectedRole === 'teacher' 
              ? 'none'
              : '3px solid #E5E7EB',
            display: 'flex',
            flexDirection: 'column',
            gap: '17px',
            position: 'relative',
          }}
          onClick={() => setSelectedRole('teacher')}
        >
          {selectedRole === 'teacher' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '10px',
                padding: '3px',
                background: 'linear-gradient(92.24deg, #7765DA -8.5%, #1D68BD 101.3%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          )}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                color: '#000000',
                margin: 0,
              }}
            >
              I'm a Teacher
            </h2>
            <p 
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '16px',
                fontWeight: 400,
                color: '#6B7280',
                lineHeight: 'normal',
                margin: 0,
              }}
            >
              Submit answers and view live poll results in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        style={{
          width: '233.93408203125px',
          height: '57.58056640625px',
          borderRadius: '34px',
          paddingTop: '17px',
          paddingRight: '70px',
          paddingBottom: '17px',
          paddingLeft: '70px',
          background: 'linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%)',
          color: '#FFFFFF',
          border: 'none',
          fontFamily: 'Sora, sans-serif',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'opacity 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => e.target.style.opacity = '0.9'}
        onMouseLeave={(e) => e.target.style.opacity = '1'}
      >
        Continue
      </button>
    </div>
  );
};

export default LandingPage;
