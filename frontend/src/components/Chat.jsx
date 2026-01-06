import { useState, useEffect, useRef } from 'react';
// import { usePoll } from '../hooks/usePoll';
import socket from '../services/socket';

const Chat = ({ isOpen, onClose, userRole, userName }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket event listeners
  useEffect(() => {
    // Listen for new messages
    const handleNewMessage = (data) => {
      setMessages(prev => [...prev, data]);
    };

    // Listen for participants update
    const handleParticipantsUpdate = (data) => {
      setParticipants(data.participants || []);
    };

    socket.on('chatMessage', handleNewMessage);
    socket.on('participantsUpdate', handleParticipantsUpdate);

    // Request participants list when opening
    if (isOpen) {
      socket.emit('getParticipants');
    }

    return () => {
      socket.off('chatMessage', handleNewMessage);
      socket.off('participantsUpdate', handleParticipantsUpdate);
    };
  }, [isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket.emit('sendMessage', {
        message: newMessage.trim(),
        sender: userName,
        role: userRole,
        timestamp: Date.now()
      });
      setNewMessage('');
    }
  };

  const handleKickStudent = (socketId) => {
    if (userRole === 'teacher') {
      socket.emit('kickStudent', { socketId });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '429px',
        maxHeight: '90vh',
        height: '477px',
        background: '#FFFFFF',
        borderRadius: '4px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('chat')}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: 'transparent',
              fontFamily: 'Sora, sans-serif',
              fontSize: '14px',
              fontWeight: activeTab === 'chat' ? 600 : 400,
              color: activeTab === 'chat' ? '#7565D9' : '#6B7280',
              cursor: 'pointer',
              borderBottom: activeTab === 'chat' ? '2px solid #7565D9' : '2px solid transparent',
            }}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('participants')}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: 'transparent',
              fontFamily: 'Sora, sans-serif',
              fontSize: '14px',
              fontWeight: activeTab === 'participants' ? 600 : 400,
              color: activeTab === 'participants' ? '#7565D9' : '#6B7280',
              cursor: 'pointer',
              borderBottom: activeTab === 'participants' ? '2px solid #7565D9' : '2px solid transparent',
            }}
          >
            Participants
          </button>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            color: '#6B7280',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div
        ref={chatContainerRef}
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {activeTab === 'chat' ? (
          <>
            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {messages.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    color: '#9CA3AF',
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '14px',
                    marginTop: '20px',
                  }}
                >
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isOwnMessage = msg.sender === userName;
                  return (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
                        gap: '4px',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'Sora, sans-serif',
                          fontSize: '12px',
                          color: '#6B7280',
                          padding: '0 8px',
                        }}
                      >
                        {msg.sender} {msg.role === 'teacher' && '(Teacher)'}
                      </div>
                      <div
                        style={{
                          maxWidth: '70%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          background: isOwnMessage
                            ? 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)'
                            : '#F3F4F6',
                          color: isOwnMessage ? '#FFFFFF' : '#000000',
                          fontFamily: 'Sora, sans-serif',
                          fontSize: '14px',
                          wordWrap: 'break-word',
                        }}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              style={{
                padding: '16px',
                borderTop: '1px solid #E5E7EB',
                display: 'flex',
                gap: '8px',
              }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          /* Participants Tab */
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
            }}
          >
            {participants.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  color: '#9CA3AF',
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '14px',
                  marginTop: '20px',
                }}
              >
                No participants yet
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Table Header */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: userRole === 'teacher' ? '1fr auto' : '1fr',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #E5E7EB',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '14px',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#000000',
                    }}
                  >
                    Name
                  </div>
                  {userRole === 'teacher' && (
                    <div
                      style={{
                        fontFamily: 'Sora, sans-serif',
                        fontSize: '14px',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        color: '#000000',
                      }}
                    >
                      Action
                    </div>
                  )}
                </div>

                {/* Participants List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {participants
                    .filter(participant => participant.role !== 'teacher')
                    .map((participant, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: userRole === 'teacher' ? '1fr auto' : '1fr',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'Sora, sans-serif',
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#000000',
                        }}
                      >
                        {participant.name}
                      </div>
                      {userRole === 'teacher' && participant.role === 'student' && (
                        <button
                          onClick={() => handleKickStudent(participant.socketId)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            fontFamily: 'Sora, sans-serif',
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#2563EB',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            padding: 0,
                            textAlign: 'left',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = '#1D4ED8';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = '#2563EB';
                          }}
                        >
                          Kick out
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;


