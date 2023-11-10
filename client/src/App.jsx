import { useEffect } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/timeline" element={<Dashboard />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/login');
  }, []);

  return <div>Redirecting...</div>;
}

export default App;
