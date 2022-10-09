import React from 'react';
import { Link } from 'react-router-dom';
import LoginItem from '../components/LoginItem';

function Login(props) {
  return (
    <div className="container my-1">
      <Link to="/signup">← Go to Signup</Link>
      <LoginItem />
      <h2>Login</h2>
    </div>
  );
}

export default Login;
