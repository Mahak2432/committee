import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/userActions';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const HodSidebar = ({ sidebarOpen, closeSidebar }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userCred } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <div className={sidebarOpen ? 'sidebar_responsive' : ''} id='sidebar'>
      <div className='sidebar__title'>
        <i
          onClick={() => closeSidebar()}
          className='fa fa-times'
          id='sidebarIcon'
          aria-hidden='true'
        ></i>
      </div>

      <div className='sidebar__menu'>
        <h2>Hod Dashboard</h2>
        <div className='sidebar__link'>
          <i className='fas fa-user'></i>
          <span className='linked'>Name: {userCred?.hod_name}</span>
        </div>
        <div className='sidebar__link'>
          <i className='fas fa-envelope'></i>
          <span className='linked'>Email: {userCred?.email}</span>
        </div>
        <div className='sidebar__link'>
          <i className='fas fa-mail-bulk'></i>
          <a className='linked' href='https://mail.google.com/mail/u/0/#compose' target='_blank' rel='noopener noreferrer'>
            Email
          </a>
        </div>
        <div className='sidebar__logout'>
          <i className='fa fa-power-off'></i>
          <Link className='linked' onClick={logoutHandler} to='/login'>
            Log out
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HodSidebar;
