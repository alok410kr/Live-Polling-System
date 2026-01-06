import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePoll } from '../hooks/usePoll';
import logoIcon from '../assets/logo.svg';
import chatIcon from '../assets/chat.svg';

const HistoryPage = () => {
  const { pollHistory, getPollHistory } = usePoll();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch poll history when component mounts
    getPollHistory();
  }, [getPollHistory]);

  return (
    <div 
      className="h-screen bg-gray-100 flex items-center justify-center px-4 py-8"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1440px',
        height: '100vh',
        background: '#FFFFFF',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-lg"
        style={{
          width: '100%',
          maxWidth: '981px',
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          position: 'relative',
        }}
      >
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

        {/* Header */}
        <div
  style={{
    marginTop: '60px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}
>
  <h1
    style={{
      fontFamily: 'Sora, sans-serif',
      fontSize: '32px',
      fontWeight: 700,
      color: '#000000',
      margin: 0,
    }}
  >
    View Poll History
  </h1>

          <button
            onClick={() => navigate('/teacher')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #7565D9',
              background: '#FFFFFF',
              color: '#7565D9',
              fontFamily: 'Sora, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#F3F4F6';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#FFFFFF';
            }}
          >
            Back to Dashboard
          </button>
        </div>

        {/* Poll History List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
          {pollHistory.length === 0 ? (
            <div 
              style={{
                padding: '60px 20px',
                textAlign: 'center',
              }}
            >
              <p 
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '16px',
                  color: '#6B7280',
                  margin: 0,
                }}
              >
                No poll history yet. Create your first poll to see it here!
              </p>
            </div>
          ) : (
            pollHistory.slice().reverse().map((poll, index) => {
              const totalVotes = poll.results?.totalVotes || 0;
              const pollOptions = poll.options || [];
              const questionNumber = index + 1; // Question 1, 2, 3, etc.
              
              return (
                <div
                  key={index}
                  style={{
                    padding: '24px',
                    borderRadius: '12px',
                    background: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    position: 'relative',
                  }}
                >
                  {/* Chat Icon */}
                  <img 
                    src={chatIcon} 
                    alt="Chat" 
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                    }}
                  />
                  
                  {/* Question Label */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span
                      style={{
                        fontFamily: 'Sora, sans-serif',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#000000',
                      }}
                    >
                      Question {questionNumber}
                    </span>
                  </div>
                  
                  {/* Question */}
                  <h3
                    style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#000000',
                      margin: 0,
                      marginBottom: '20px',
                      paddingRight: '40px',
                    }}
                  >
                    {poll.question}
                  </h3>
                  
                  {/* Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {pollOptions.map((option, optIndex) => {
                      const votes = poll.results?.results?.[option] || 0;
                      const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(0) : 0;
                      
                      return (
                        <div key={optIndex} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span
                              style={{
                                fontFamily: 'Sora, sans-serif',
                                fontSize: '16px',
                                color: '#000000',
                                fontWeight: 500,
                              }}
                            >
                              {optIndex + 1} {option}
                            </span>
                            <span
                              style={{
                                fontFamily: 'Sora, sans-serif',
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#7565D9',
                              }}
                            >
                              {percentage}%
                            </span>
                          </div>
                          <div
                            style={{
                              width: '100%',
                              height: '12px',
                              background: '#E5E7EB',
                              borderRadius: '6px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${percentage}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)',
                                borderRadius: '6px',
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;

