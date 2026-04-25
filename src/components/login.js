import React, { useState } from 'react';
import { submitLogin } from '../actions/authActions';
import { useDispatch } from 'react-redux';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

function Login() {
  const [details, setDetails] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const updateDetails = (event) => {
    setDetails({ ...details, [event.target.id]: event.target.value });
  };

  const login = async (event) => {
    event.preventDefault();
    if (!details.username || !details.password) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await dispatch(submitLogin(details));
    if (result && !result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <Form onSubmit={login} className="login-form bg-dark text-light p-4 rounded">
        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group controlId="username" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            autoComplete="username"
            value={details.username}
            onChange={updateDetails}
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={details.password}
            onChange={updateDetails}
          />
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? <><Spinner animation="border" size="sm" /> Signing in...</> : 'Sign In'}
        </Button>
      </Form>
    </div>
  );
}

export default Login;
