import { useState, useRef, useEffect } from 'react';
import { usePoll } from '../hooks/usePoll';
import Chat from '../components/Chat';
import KickedOutPage from './KickedOutPage';
import chatIcon from '../assets/chat.svg';
import logoIcon from '../assets/logo.svg';
import alarmIcon from '../assets/alarm.svg';

const StudentPage = () => {
  const { 
    studentName: savedName, 
    joinAsStudent, 
    currentPoll, 
    timeRemaining,
    hasAnswered,
    submittedAnswer,
    results,
    submitAnswer,
    setStudentName,
    isConnected,
    isKickedOut
  } = usePoll();
  const [name, setName] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const prevPollQuestionRef = useRef(null);

  // Debug: Log current poll state
  useEffect(() => {
    console.log('StudentPage - currentPoll:', currentPoll);
    console.log('StudentPage - isConnected:', isConnected);
    console.log('StudentPage - hasSubmitted:', hasSubmitted);
  }, [currentPoll, isConnected, hasSubmitted]);

  // Clear saved name when component mounts (ask for name every time)
  useEffect(() => {
    if (savedName) {
      setStudentName(null); // Clear the saved name
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset selected answer when new poll arrives
  useEffect(() => {
    if (currentPoll && currentPoll.question !== prevPollQuestionRef.current && !hasAnswered) {
      prevPollQuestionRef.current = currentPoll.question;
      setSelectedAnswer(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPoll?.question, hasAnswered]);

  const handleContinue = () => {
    if (name.trim()) {
      joinAsStudent(name.trim());
      setHasSubmitted(true);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer && currentPoll) {
      submitAnswer(selectedAnswer);
      setSelectedAnswer(null);
    }
  };

  // If student is kicked out, show kicked out page
  if (isKickedOut) {
    return <KickedOutPage />;
  }

  // If name is set, check for poll state
  if (hasSubmitted || savedName) {
    // If there's a poll and student hasn't answered, show poll interface
    if (currentPoll && currentPoll.status !== 'ended' && !hasAnswered) {
      return (
        <>
          <div className="h-screen bg-gray-100 flex items-center justify-center px-8 py-12" style={{ overflow: 'hidden' }}>
          <div 
            className="bg-white rounded-lg shadow-lg"
            style={{
              width: '100%',
              maxWidth: '727px',
              minHeight: '353px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              borderRadius: '9px',
              border: '1px solid #E5E7EB',
              boxSizing: 'border-box',
            }}
          >
            {/* Question Label and Timer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <label
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#000000',
                }}
              >
                Question 1
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img 
                  src={alarmIcon} 
                  alt="Timer" 
                  style={{ width: '16px', height: '20px' }} 
                />
                <span
                  style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#DC2626',
                  }}
                >
                  {String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:{String(timeRemaining % 60).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Question Box */}
            <div
              style={{
                padding: '16px',
                borderRadius: '8px',
                background: '#373737',
                color: '#FFFFFF',
                fontFamily: 'Sora, sans-serif',
                fontSize: '18px',
                fontWeight: 500,
              }}
            >
              {currentPoll.question}
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#F9FAFB', padding: '16px', borderRadius: '8px' }}>
              {currentPoll.options && currentPoll.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(option)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #7565D9' : '1px solid #E5E7EB',
                      background: '#FFFFFF',
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '16px',
                      color: '#000000',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.target.style.borderColor = '#7565D9';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.target.style.borderColor = '#E5E7EB';
                      }
                    }}
                  >
                    {/* Numbered Circle */}
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isSelected 
                          ? 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)' 
                          : '#E5E7EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Sora, sans-serif',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: isSelected ? '#FFFFFF' : '#6B7280',
                        }}
                      >
                        {index + 1}
                      </span>
                    </div>
                    <span style={{ flex: 1, textAlign: 'left' }}>{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                style={{
                  padding: '14px 32px',
                  borderRadius: '34px',
                  background: selectedAnswer
                    ? 'linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%)'
                    : '#D1D5DB',
                  color: '#FFFFFF',
                  border: 'none',
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: selectedAnswer ? 'pointer' : 'not-allowed',
                  transition: 'opacity 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (selectedAnswer) e.target.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  if (selectedAnswer) e.target.style.opacity = '1';
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        {/* Chat Button */}
        <button
          onClick={() => setShowChat(!showChat)}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '80px',
            height: '76px',
            paddingTop: '19px',
            paddingRight: '20px',
            paddingBottom: '14px',
            paddingLeft: '20px',
            borderRadius: '50%',
            background: 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 4px 12px rgba(117, 101, 217, 0.3)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            zIndex: 999,
            boxSizing: 'border-box',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 16px rgba(117, 101, 217, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(117, 101, 217, 0.3)';
          }}
        >
          <img src={chatIcon} alt="Chat" style={{ width: '39px', height: '39px' }} />
        </button>
        <Chat 
          isOpen={showChat} 
          onClose={() => setShowChat(false)} 
          userRole="student"
          userName={hasSubmitted || savedName ? (savedName || name) : 'Student'}
        />
      </>
      );
    }

    // Show results only when poll has ended (all students answered or timer stopped)
    if (currentPoll && currentPoll.status === 'ended' && results) {
      return (
        <>
        <div className="h-screen bg-gray-100 flex items-center justify-center px-8 py-12" style={{ overflow: 'hidden' }}>
          <div 
            className="bg-white rounded-lg shadow-lg"
            style={{
              width: '100%',
              maxWidth: '657px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <div 
                className="text-white text-sm font-medium flex items-center"
                style={{
                  width: 'fit-content',
                  height: '28px',
                  borderRadius: '20px',
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  gap: '5px',
                  background: 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)',
                  display: 'inline-flex',
                }}
              >
                <span>
                  <img 
                    src={logoIcon} 
                    alt="Intervue Poll" 
                    style={{
                      width: '12px',
                      height: '12px',
                      opacity: 1,
                    }}
                  />
                </span>
                <span 
                  style={{
                    fontFamily: 'Sora, sans-serif',
                    fontWeight: 600,
                    fontSize: '13px',
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
            </div>

            {/* Question Box - Match teacher view */}
            <div
              style={{
                padding: '16px',
                borderRadius: '8px',
                background: '#373737',
                color: '#FFFFFF',
                fontFamily: 'Sora, sans-serif',
                fontSize: '18px',
                fontWeight: 500,
                marginBottom: '8px',
              }}
            >
              {currentPoll?.question || 'Poll Results'}
            </div>

            {/* Results - Only shown when poll has ended */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {currentPoll?.options && currentPoll.options.map((option, index) => {
                const votes = results.results?.[option] || 0;
                const total = results.totalVotes || 1;
                const percentage = total > 0 ? (votes / total) * 100 : 0;
                const isCorrect = currentPoll?.correctAnswer === option;
                const isStudentAnswer = hasAnswered && submittedAnswer === option;
                
                return (
                  <div 
                    key={index} 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '8px',
                      padding: '12px',
                      borderRadius: '8px',
                      background: isCorrect ? '#D1FAE5' : (isStudentAnswer ? '#FEF3C7' : 'transparent'),
                      border: isCorrect ? '2px solid #10B981' : (isStudentAnswer ? '2px solid #F59E0B' : 'none'),
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'Sora, sans-serif', fontSize: '16px', color: '#000000', fontWeight: (isCorrect || isStudentAnswer) ? 600 : 400 }}>
                          {option}
                        </span>
                        {isCorrect && (
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 20 20" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ flexShrink: 0 }}
                          >
                            <path 
                              d="M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z" 
                              fill="#10B981"
                            />
                          </svg>
                        )}
                        {isStudentAnswer && !isCorrect && (
                          <span 
                            style={{
                              fontFamily: 'Sora, sans-serif',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: '#F59E0B',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: '#FEF3C7',
                            }}
                          >
                            Your Answer
                          </span>
                        )}
                      </div>
                      <span style={{ fontFamily: 'Sora, sans-serif', fontSize: '16px', fontWeight: 600, color: isCorrect ? '#10B981' : (isStudentAnswer ? '#F59E0B' : '#374151') }}>
                        {votes} votes ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '32px',
                        background: '#E5E7EB',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: isCorrect 
                            ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                            : isStudentAnswer && !isCorrect
                              ? 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)'
                              : 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)',
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop: '8px', fontFamily: 'Sora, sans-serif', fontSize: '14px', color: '#6B7280' }}>
                Total votes: {results.totalVotes || 0} | Total students: {results.totalStudents || 0}
              </div>
            </div>
          </div>
        </div>
        {/* Chat Button */}
        <button
          onClick={() => setShowChat(!showChat)}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '80px',
            height: '76px',
            paddingTop: '19px',
            paddingRight: '20px',
            paddingBottom: '14px',
            paddingLeft: '20px',
            borderRadius: '50%',
            background: 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 4px 12px rgba(117, 101, 217, 0.3)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            zIndex: 999,
            boxSizing: 'border-box',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 16px rgba(117, 101, 217, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(117, 101, 217, 0.3)';
          }}
        >
          <img src={chatIcon} alt="Chat" style={{ width: '39px', height: '39px' }} />
        </button>
        <Chat 
          isOpen={showChat} 
          onClose={() => setShowChat(false)} 
          userRole="student"
          userName={hasSubmitted || savedName ? (savedName || name) : 'Student'}
        />
        </>
      );
    }

    // Otherwise show waiting interface
    return (
      <>
      <div className="h-screen bg-gray-100 flex items-center justify-center px-8 py-12 relative" style={{ overflow: 'hidden' }}>
        {/* White Card Container */}
          <div 
            className="bg-white rounded-lg shadow-lg relative"
            style={{
              width: '100%',
              maxWidth: '657px',
              minHeight: '500px',
              padding: '40px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '40px',
              position: 'relative',
            }}
          >
          {/* Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div 
              className="text-white text-sm font-medium flex items-center"
              style={{
                width: 'fit-content',
                height: '28px',
                borderRadius: '20px',
                paddingLeft: '8px',
                paddingRight: '8px',
                gap: '5px',
                background: 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)',
                display: 'inline-flex',
              }}
            >
              <span>
                <img 
                  src={logoIcon} 
                  alt="Intervue Poll" 
                  style={{
                    width: '12px',
                    height: '12px',
                    opacity: 1,
                  }}
                />
              </span>
              <span 
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 600,
                  fontSize: '13px',
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
          </div>

          {/* Loading Spinner */}
          <div
            style={{
              width: '60px',
              height: '60px',
              border: '4px solid #E5E7EB',
              borderTop: '4px solid #7565D9',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />

          {/* Waiting Text */}
          <div
            style={{
              width: '737px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p 
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '33px',
                fontWeight: 600,
                fontStyle: 'normal',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#000000',
                margin: 0,
              }}
            >
              Wait for teacher to ask questions
            </p>
          </div>
        </div>

        {/* CSS Animation for Spinner */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
      {/* Chat Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '80px',
          height: '76px',
          paddingTop: '19px',
          paddingRight: '20px',
          paddingBottom: '14px',
          paddingLeft: '20px',
          borderRadius: '50%',
          background: 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          boxShadow: '0 4px 12px rgba(117, 101, 217, 0.3)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          zIndex: 999,
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 16px rgba(117, 101, 217, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 12px rgba(117, 101, 217, 0.3)';
        }}
      >
        <img src={chatIcon} alt="Chat" style={{ width: '24px', height: '24px' }} />
      </button>
      <Chat 
        isOpen={showChat} 
        onClose={() => setShowChat(false)} 
        userRole="student"
        userName={hasSubmitted || savedName ? (savedName || name) : 'Student'}
      />
    </>
    );
  }

  // Name input page
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-8 py-12">
      {/* White Card Container */}
      <div 
        className="bg-white rounded-lg shadow-lg"
        style={{
          width: '100%',
          maxWidth: '981px',
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '40px',
        }}
      >
        {/* Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div 
            className="text-white text-sm font-medium flex items-center"
            style={{
              width: 'fit-content',
              height: '31px',
              borderRadius: '24px',
              paddingLeft: '9px',
              paddingRight: '9px',
              gap: '7px',
              background: 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)',
              display: 'inline-flex',
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
        </div>

        {/* Title Container */}
        <div
          style={{
            width: '737px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1 
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '40px',
              fontWeight: 400,
              fontStyle: 'normal',
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'center',
              color: '#000000',
              margin: 0,
            }}
          >
            Let's <span style={{ fontWeight: 600 }}>Get Started</span>
          </h1>
        </div>

        {/* Description */}
        <p 
          style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            color: '#000000',
            lineHeight: '1.5',
            margin: 0,
            textAlign: 'center',
            maxWidth: '737px',
          }}
        >
          If you're a student, you'll be able to <strong style={{ fontWeight: 600 }}>submit your answers</strong>, participate in live polls, and see how your responses compare with your classmates.
        </p>

        {/* Name Input */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          width: '100%',
          maxWidth: '737px',
        }}>
          <label 
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
            }}
          >
            Enter your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rahul Bajaj"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              fontSize: '16px',
              fontFamily: 'Sora, sans-serif',
              outline: 'none',
              backgroundColor: '#F9FAFB',
              color: '#000000',
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleContinue();
              }
            }}
          />
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!name.trim()}
          style={{
            width: '233.93408203125px',
            height: '57.58056640625px',
            borderRadius: '34px',
            background: name.trim() 
              ? 'linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%)'
              : '#D1D5DB',
            color: '#FFFFFF',
            border: 'none',
            fontFamily: 'Sora, sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            cursor: name.trim() ? 'pointer' : 'not-allowed',
            transition: 'opacity 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
          onMouseEnter={(e) => {
            if (name.trim()) e.target.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            if (name.trim()) e.target.style.opacity = '1';
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StudentPage;
