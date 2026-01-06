import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TeacherPage from './pages/TeacherPage';
import StudentPage from './pages/StudentPage';
import HistoryPage from './pages/HistoryPage';
import Toast from './components/Toast';
import './services/socket'; // Initialize socket connection
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Toast />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/teacher" element={<TeacherPage />} />
          <Route path="/teacher/history" element={<HistoryPage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
