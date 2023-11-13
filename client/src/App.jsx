import { useEffect } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Activities from './components/DashBoard/Activities/Activities';
import Fitscale from './pages/Fitscale';
import Test from './pages/Test';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/timeline" element={<Dashboard />} />
        <Route path="/dashboard/activities" element={<Activities />} />
        <Route path="/dashboard/fitscale" element={<Fitscale />} />
        <Route path="/test" element={<Test />} />
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
