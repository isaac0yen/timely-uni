import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SelectRole from './pages/SelectRole';
import LoginPage from './pages/Login';
import EmailVerificationPage from './pages/EmailVerification';
import RegisterPage from './pages/Register';
import Dashboard from './pages/Dashboard';
import ErrorPage from './pages/Error';
import Courses from './pages/Courses';
import RoomPage from './pages/Rooms'
import Timetable from './pages/Timetable';

const App = () => {
  return (
    <div className="min-h-screen bg-navy-blue text-white">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/select-role/" element={<SelectRole />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course" element={<Courses />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/register/:role" element={<RegisterPage />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/rooms" element={<RoomPage/>} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default App;
