import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../actions/userActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import './Login.css';

const Login = ({ history, location }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Admin'); // Default user type
  const [toggle, setToggle] = useState(false);

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userCred } = userLogin;

  useEffect(() => {
    if (userCred) {
      // Redirect based on user type
      switch (userCred.userType) {
        case 'Admin':
          history.push('/');
          break;
        case 'CommitteeMember':
          history.push('/committee/dashboard');
          break;
        case 'Hod':
          history.push('/hod/dashboard');
          break;
        case 'Chairperson':
          history.push('/chairperson_landing');
          break;
        default:
          history.push('/');
          break;
      }
    }
  }, [history, userCred]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password, userType));
  };

  return (
    <div className="container">
      <div className="layout">
        <h1>Sign In</h1>
        {error && <Message variant="danger" message={error} />}
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={submitHandler}>
            <input
              className="form-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <div className="password-eye">
              <input
                className="form-field"
                type={toggle ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              {toggle ? (
                <i id="eye" className="fas fa-eye" onClick={() => setToggle(!toggle)}></i>
              ) : (
                <i id="eye" className="fas fa-eye-slash" onClick={() => setToggle(!toggle)}></i>
              )}
            </div>
            <select
              className="form-field"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
            >
              <option value="Admin">Admin</option>
              <option value="CommitteeMember">Committee Member</option>
              <option value="Hod">HOD</option>
              <option value="Chairperson">Chairperson</option>
            </select>
            <div className="remember-me">
              <input type="checkbox" id="check" />
              <label htmlFor="check">Remember me</label>
            </div>
            <button className="btn" type="submit">Login</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
