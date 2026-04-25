import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Login from './login';
import Register from './register';
import { Nav } from 'react-bootstrap';

const Authentication = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  const loggedIn = useSelector((state) => state.auth.loggedIn);

  // Redirect to movie list as soon as user logs in
  useEffect(() => {
    if (loggedIn) {
      navigate('/movielist');
    }
  }, [loggedIn, navigate]);

  const handleSelect = (selectedKey) => {
    setActiveTab(selectedKey);
  };

  return (
    <div className="auth-container">
      <Nav variant="tabs" activeKey={activeTab} onSelect={handleSelect} className="mb-3 dark-tabs justify-content-center">
        <Nav.Item>
          <Nav.Link eventKey="login">Login</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="register">Register</Nav.Link>
        </Nav.Item>
      </Nav>
      {activeTab === 'register' ? <Register /> : <Login />}
    </div>
  );
};

export default Authentication;
