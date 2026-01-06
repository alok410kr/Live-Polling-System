import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePoll } from '../hooks/usePoll';
import Chat from '../components/Chat';
import chatIcon from '../assets/chat.svg';
import logoIcon from '../assets/logo.svg';
import viewHistoryIcon from '../assets/viewHistory.svg';
import socket from '../services/socket';

const TeacherPage = () => {
  const { createPoll, error, currentPoll, timeRemaining, results, getResults, resetPoll } = usePoll();
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  // Join as teacher when component mounts and request state recovery
  useEffect(() => {
    socket.emit('joinAsTeacher');
    // Request current poll state for state recovery
    socket.emit('getCurrentPollState');
    return () => {
      // Cleanup if needed
    };
  }, []);
  const [question, setQuestion] = useState('');
  const [timer, setTimer] = useState(60);
  const [options, setOptions] = useState([
    { id: 1, text: '', isCorrect: true },
    { id: 2, text: '', isCorrect: false },
  ]);
  const [showTimerDropdown, setShowTimerDropdown] = useState(false);
  const timerDropdownRef = useRef(null);

  const timerOptions = [30, 60, 90, 120, 180];

  // Get results periodically when poll is active
  useEffect(() => {
    let interval;
    if (currentPoll && currentPoll.status === 'active') {
      getResults();
      interval = setInterval(() => {
        getResults();
      }, 2000); // Update every 2 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentPoll, getResults]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timerDropdownRef.current && !timerDropdownRef.current.contains(event.target)) {
        setShowTimerDropdown(false);
      }
    };

    if (showTimerDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTimerDropdown]);

  const handleAddOption = () => {
    setOptions([...options, { id: Date.now(), text: '', isCorrect: false }]);
  };

  const handleRemoveOption = (id) => {
    if (options.length > 2) {
      setOptions(options.filter(opt => opt.id !== id));
    }
  };

  const handleOptionChange = (id, field, value) => {
    if (field === 'isCorrect' && value === true) {
      // If setting an option as correct, set all others to false
      setOptions(options.map(opt => 
        opt.id === id 
          ? { ...opt, [field]: value } 
          : { ...opt, isCorrect: false }
      ));
    } else {
      // For other fields, update normally (no duplicate check here - allow same initial text)
      setOptions(options.map(opt => 
        opt.id === id ? { ...opt, [field]: value } : opt
      ));
    }
  };

  const handleAskQuestion = () => {
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    const validOptions = options
      .filter(opt => opt.text.trim())
      .map(opt => opt.text.trim());

    if (validOptions.length < 2) {
      alert('Please add at least 2 options');
      return;
    }

    // Check for duplicate options (case-insensitive check)
    const optionTextsLower = validOptions.map(opt => opt.toLowerCase());
    const uniqueOptions = [...new Set(optionTextsLower)];
    if (uniqueOptions.length !== validOptions.length) {
      alert('Duplicate options are not allowed! Each option must be unique. Please make sure all options have different text.');
      return;
    }

    // Find the correct answer - ensure only one is marked as correct
    const correctOptions = options.filter(opt => opt.isCorrect === true && opt.text.trim());
    if (correctOptions.length === 0) {
      alert('Please mark at least one option as correct');
      return;
    }
    if (correctOptions.length > 1) {
      alert('Only one option can be marked as correct');
      return;
    }

    const correctAnswer = correctOptions[0].text.trim();

    createPoll({
      question: question.trim(),
      options: validOptions,
      correctAnswer: correctAnswer,
      timer: timer,
    });

    // Reset form
    setQuestion('');
    setOptions([
      { id: 1, text: '', isCorrect: true },
      { id: 2, text: '', isCorrect: false },
    ]);
  };

  const handleCreateNewPoll = () => {
    resetPoll();
    setQuestion('');
    setOptions([
      { id: 1, text: '', isCorrect: true },
      { id: 2, text: '', isCorrect: false },
    ]);
  };

  // Show results view if poll exists (active or ended)
  if (currentPoll) {
    return (
      <>
        <div 
          className="bg-gray-100 flex items-center justify-center"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1440px',
            height: '100vh',
            background: '#FFFFFF',
            margin: '0 auto',
            overflow: 'hidden',
            padding: '20px',
            boxSizing: 'border-box',
          }}
        >
          {/* Header with View Poll History Button - positioned at top right */}
          <div
            className="view-history-button-container"
            style={{
              position: 'absolute',
              top: '10px',
              right: '20px',
              zIndex: 1000,
              pointerEvents: 'auto',
            }}
          >
            <button
              onClick={() => navigate('/teacher/history')}
              style={{
                width: '267px',
                height: '53px',
                borderRadius: '34px',
                backgroundColor: '#8F64E1',
                border: 'none',
                opacity: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontFamily: 'Sora, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '20px',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
                boxSizing: 'border-box',
                padding: '0 16px',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <img
                src={viewHistoryIcon}
                alt="View History"
                style={{ width: '20px', height: '20px', flexShrink: 0 }}
              />
              <span>View Poll History</span>
            </button>
          </div>
          <style>{`
            @media (max-width: 768px) {
              .view-history-button-container {
                top: 10px !important;
                right: 10px !important;
              }
              .view-history-button-container button {
                width: auto !important;
                min-width: 180px !important;
                max-width: 267px !important;
                font-size: 14px !important;
                height: 45px !important;
              }
            }
          `}</style>
        <div 
          className="bg-white rounded-lg shadow-lg"
          style={{
            width: '100%',
            maxWidth: '800px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            position: 'relative',
            maxHeight: 'calc(100vh - 40px)',
            overflow: 'auto',
            boxSizing: 'border-box',
          }}
        >

          {/* Question Label */}
          <label
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              color: '#000000',
              marginBottom: '8px',
            }}
          >
            Question
          </label>

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
              marginBottom: '8px',
            }}
          >
            {currentPoll.question}
          </div>

          {/* Timer (if active) */}
          {currentPoll.status === 'active' && (
            <div
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: timeRemaining <= 10 ? '#FEE2E2' : '#F3F4F6',
                color: timeRemaining <= 10 ? '#DC2626' : '#374151',
                fontFamily: 'Sora, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                width: 'fit-content',
                marginBottom: '16px',
              }}
            >
              {timeRemaining}s
            </div>
          )}

          {/* Options List - Show without results when active, with results when ended */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentPoll.options && currentPoll.options.map((option, index) => {
              // Show results if poll is active (with real-time updates) or ended
              const showResults = (currentPoll.status === 'active' && results) || (currentPoll.status === 'ended' && results);
              const votes = showResults ? (results.results?.[option] || 0) : 0;
              const total = showResults ? (results.totalVotes || 1) : 1;
              const percentage = showResults && total > 0 ? (votes / total) * 100 : 0;
              const hasVotes = showResults && votes > 0;
              const isCorrect = currentPoll?.correctAnswer === option;
              
              return (
                <div 
                  key={index} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    background: isCorrect && showResults 
                      ? '#D1FAE5' 
                      : hasVotes 
                        ? 'rgba(117, 101, 217, 0.1)' 
                        : '#F9FAFB',
                    border: isCorrect && showResults ? '2px solid #10B981' : 'none',
                  }}
                >
                  {/* Numbered Circle */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isCorrect && showResults
                        ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                        : hasVotes 
                          ? 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)' 
                          : '#E5E7EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isCorrect && showResults ? (
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 20 20" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z" 
                          fill="#FFFFFF"
                        />
                      </svg>
                    ) : (
                      <span
                        style={{
                          fontFamily: 'Sora, sans-serif',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: isCorrect && showResults ? '#FFFFFF' : hasVotes ? '#FFFFFF' : '#6B7280',
                        }}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Option Text */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <span 
                      style={{ 
                        fontFamily: 'Sora, sans-serif', 
                        fontSize: '16px', 
                        color: '#000000', 
                        fontWeight: isCorrect && showResults ? 600 : 500,
                      }}
                    >
                      {option}
                    </span>
                    {isCorrect && showResults && (
                      <span 
                        style={{
                          fontFamily: 'Sora, sans-serif',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#10B981',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: '#ECFDF5',
                        }}
                      >
                        Correct
                      </span>
                    )}
                  </div>

                  {/* Percentage - Show when poll is active or ended */}
                  {showResults && (
                    <span 
                      style={{ 
                        fontFamily: 'Sora, sans-serif', 
                        fontSize: '16px', 
                        fontWeight: 600, 
                        color: isCorrect && currentPoll.status === 'ended' ? '#10B981' : '#7565D9',
                        minWidth: '50px',
                        textAlign: 'right',
                      }}
                    >
                      {percentage.toFixed(0)}%
                    </span>
                  )}

                  {/* Progress Bar - Show when poll is active or ended */}
                  {showResults && (
                    <div
                      style={{
                        width: '200px',
                        height: '12px',
                        background: '#E5E7EB',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: isCorrect 
                            ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                            : hasVotes 
                              ? 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)' 
                              : '#E5E7EB',
                          borderRadius: '6px',
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Ask a new question Button (only if poll ended) */}
          {currentPoll.status === 'ended' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                onClick={handleCreateNewPoll}
                style={{
                  padding: '14px 24px',
                  borderRadius: '34px',
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
                  gap: '8px',
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Ask a new question</span>
              </button>
            </div>
          )}
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
          userRole="teacher"
          userName="Teacher"
        />
      </>
    );
  }

  // Show form view when no active poll
  return (
    <>
    <div 
      className="bg-gray-100 flex items-center justify-center"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1440px',
        height: '100vh',
        background: '#FFFFFF',
        margin: '0 auto',
        overflow: 'hidden',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      {/* White Card Container */}
          <div 
            className="bg-white rounded-lg shadow-lg"
            style={{
              width: '100%',
              maxWidth: '981px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '20px',
              position: 'relative',
              maxHeight: 'calc(100vh - 40px)',
              overflow: 'auto',
              boxSizing: 'border-box',
            }}
          >
        {/* View Poll History Button - positioned at top right */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '20px',
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => navigate('/teacher/history')}
            style={{
              width: '267px',
              height: '53px',
              borderRadius: '34px',
              background: '#8F64E1',
              color: '#FFFFFF',
              border: 'none',
              fontFamily: 'Sora, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxSizing: 'border-box',
              padding: '0 16px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '1';
            }}
          >
            <img 
              src={viewHistoryIcon} 
              alt="View History" 
              style={{ 
                width: '20px', 
                height: '20px',
                flexShrink: 0,
              }} 
            />
            <span>View Poll History</span>
          </button>
        </div>

        {/* Badge */}
        <div 
          style={{
            width: '134px',
            height: '31px',
            borderRadius: '24px',
            padding: '0px 9px',
            gap: '7px',
            background: 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-start',
            boxSizing: 'border-box',
            overflow: 'hidden',
            marginTop: '80px',
          }}
        >
          <img 
            src={logoIcon} 
            alt="Intervue Poll" 
            style={{
              width: '14.66px',
              height: '14.65px',
              flexShrink: 0,
              display: 'block',
            }}
          />
          <span 
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '18px',
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            Intervue Poll
          </span>
        </div>

        {/* Title and History Button */}
        <div 
          style={{ 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '16px' }}>
            <h1 
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: 'clamp(24px, 5vw, 32px)',
                fontWeight: 700,
                color: '#000000',
                margin: 0,
                textAlign: 'left',
              }}
            >
              Let's Get Started
            </h1>
          </div>
          
          {/* Description */}
          <p 
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#6B7280',
              lineHeight: '1.4',
              margin: 0,
              textAlign: 'left',
            }}
          >
            you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
          </p>
        </div>

        {/* Question Input Section */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px', 
              width: '100%',
            }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            width: '100%',
            height: '43px',
          }}>
            <label 
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',
              }}
            >
              Enter your question
            </label>
            
            {/* Timer Dropdown */}
            <div ref={timerDropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowTimerDropdown(!showTimerDropdown)}
                style={{
                  width: '170px',
                  height: '43px',
                  borderRadius: '7px',
                  paddingTop: '10px',
                  paddingRight: '18px',
                  paddingBottom: '10px',
                  paddingLeft: '18px',
                  gap: '10px',
                  border: '1px solid #E5E7EB',
                  background: '#FFFFFF',
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '14px',
                  color: '#374151',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                }}
              >
                <span>{timer} seconds</span>
                <svg 
                  width="19" 
                  height="18" 
                  viewBox="0 0 19 18" 
                  fill="none" 
                  style={{ 
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                    transform: 'rotate(179.35deg)',
                  }}
                >
                  <polygon 
                    points="9.5,0 19,18 0,18" 
                    fill="#480FB3"
                  />
                </svg>
              </button>
              
              {showTimerDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '4px',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 10,
                    minWidth: '120px',
                  }}
                >
                  {timerOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setTimer(option);
                        setShowTimerDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 16px',
                        textAlign: 'left',
                        fontFamily: 'Sora, sans-serif',
                        fontSize: '14px',
                        color: '#374151',
                        background: timer === option ? '#F3F4F6' : '#FFFFFF',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (timer !== option) e.target.style.background = '#F9FAFB';
                      }}
                      onMouseLeave={(e) => {
                        if (timer !== option) e.target.style.background = timer === option ? '#F3F4F6' : '#FFFFFF';
                      }}
                    >
                      {option} seconds
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <textarea
            value={question}
            onChange={(e) => {
              if (e.target.value.length <= 100) {
                setQuestion(e.target.value);
              }
            }}
            placeholder="Enter your question here..."
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              fontSize: '16px',
              fontFamily: 'Sora, sans-serif',
              outline: 'none',
              height: '80px',
              resize: 'none',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <span
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '12px',
                color: '#6B7280',
              }}
            >
              {question.length}/100
            </span>
          </div>
        </div>

        {/* Edit Options Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          {/* Header Row with Edit Options and Is it Correct? */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <label 
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',
              }}
            >
              Edit Options
            </label>
            <label 
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',
              }}
            >
              Is it Correct?
            </label>
          </div>

          {options.map((option, index) => (
            <div key={option.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Option Number Badge */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)',
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
                    color: '#FFFFFF',
                  }}
                >
                  {index + 1}
                </span>
              </div>

              {/* Option Input */}
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(option.id, 'text', e.target.value)}
                placeholder="Enter option text..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontSize: '14px',
                  fontFamily: 'Sora, sans-serif',
                  outline: 'none',
                }}
              />

              {/* Yes/No Radio Buttons - aligned with "Is it Correct?" header */}
              <div style={{ display: 'flex', gap: '12px', flexShrink: 0, width: '150px', justifyContent: 'flex-end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name={`correct-${option.id}`}
                    checked={option.isCorrect === true}
                    onChange={() => handleOptionChange(option.id, 'isCorrect', true)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontFamily: 'Sora, sans-serif', fontSize: '13px', color: '#374151' }}>
                    Yes
                  </span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name={`correct-${option.id}`}
                    checked={option.isCorrect === false}
                    onChange={() => handleOptionChange(option.id, 'isCorrect', false)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontFamily: 'Sora, sans-serif', fontSize: '13px', color: '#374151' }}>
                    No
                  </span>
                </label>
              </div>

              {/* Remove Button (only show if more than 2 options) */}
              {options.length > 2 && (
                <button
                  onClick={() => handleRemoveOption(option.id)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid #EF4444',
                    background: '#FFFFFF',
                    color: '#EF4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {/* Add More Option Button */}
          <button
            onClick={handleAddOption}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #7565D9',
              background: '#FFFFFF',
              color: '#7565D9',
              fontFamily: 'Sora, sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              width: 'fit-content',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#F3F4F6';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#FFFFFF';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3V13M3 8H13" stroke="#7565D9" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add More option
          </button>
        </div>

        {/* Ask Question Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <button
            onClick={handleAskQuestion}
            style={{
              padding: '14px 35px',
              borderRadius: '34px',
              background: 'linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%)',
              color: '#FFFFFF',
              border: 'none',
              fontFamily: 'Sora, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.3s ease',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Ask Question
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: '#FEE2E2',
              color: '#DC2626',
              fontFamily: 'Sora, sans-serif',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default TeacherPage;
