import { useEffect } from 'react';
import { Route, Routes, useNavigate, BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';
import Login from './Login';
import Signup from './Signup';
const User = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

const Redirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/login');
  }, []);

  return <div>Redirecting...</div>;
};

export default User;
