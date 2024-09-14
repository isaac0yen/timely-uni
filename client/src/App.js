import React, { useEffect } from 'react';
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
import CarryOver from './pages/CarryOver';
import Approval from './pages/Approval';


import { toast } from 'react-toastify';
import { handlePushNotification } from './pushNotifications';


const Message = ({ notification }) => {
  return (
    <>
      <div id="notificationHeader">
        {notification.image && (
          <div id="imageContainer">
            <img src={notification.image} width={100} alt="Notification" />
          </div>
        )}
        <span>{notification.title}</span>
      </div>
      <div id="notificationBody">{notification.body}</div>
    </>
  );
};

const App = () => {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
          const notification = handlePushNotification(event.data);
          toast(<Message notification={notification} />);
        }
      });
    }
  }, []);

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
        <Route path="/rooms" element={<RoomPage />} />
        <Route path="/carry-over" element={<CarryOver />} />
        <Route path="/approval" element={<Approval />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default App;
