import { useEffect } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ActivitiesHome from './pages/ActivitiesHome';
import Fitscale from './pages/Fitscale';
import TopFive from './components/DashBoard/Activities/TopFive';
import Feed from './pages/Feed';
import UserEventPage from './pages/UserEventPage';
import Profile from './pages/Profile';
import OtherUserProfile from './pages/OtherUserProfile';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/timeline" element={<Dashboard />} />
        <Route path="/dashboard/activities" element={<ActivitiesHome />} />
        <Route path="/dashboard/fitscale" element={<Fitscale />} />
        <Route path="/dashboard/activities/:id" element={<TopFive />} />
        <Route path="/dashboard/feed/" element={<Feed />} />
        <Route path="/events/:username" element={<UserEventPage />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/dashboard/feed/user/" element={<OtherUserProfile />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/dashboard/timeline');
  }, []);

  return <div>Redirecting...</div>;
}

export default App;
