import { useSelector, useDispatch } from 'react-redux';
import {
  setUserRole,
  setStudentName,
  setAnswerSubmitted,
  setError,
  clearError,
  resetPoll,
} from '../store/pollSlice';
import socket from '../services/socket';

// Custom hook for poll-related actions and state
export const usePoll = () => {
  const dispatch = useDispatch();
  const pollState = useSelector((state) => state.poll);

  return {
    // State
    ...pollState,
    
    // Actions
    setUserRole: (role) => dispatch(setUserRole(role)),
    setStudentName: (name) => dispatch(setStudentName(name)),
    setError: (error) => dispatch(setError(error)),
    clearError: () => dispatch(clearError()),
    resetPoll: () => dispatch(resetPoll()),
    
    // Socket actions
    createPoll: (pollData) => {
      socket.emit('createPoll', pollData);
    },
    
    joinAsStudent: (studentName) => {
      dispatch(setStudentName(studentName));
      socket.emit('joinAsStudent', { studentName });
    },
    
    submitAnswer: (answer) => {
      socket.emit('submitAnswer', { answer });
      dispatch(setAnswerSubmitted(answer));
    },
    
    getResults: () => {
      socket.emit('getResults');
    },
    
    getPollHistory: () => {
      socket.emit('getPollHistory');
    },
    
    joinAsTeacher: () => {
      socket.emit('joinAsTeacher');
    },
  };
};

