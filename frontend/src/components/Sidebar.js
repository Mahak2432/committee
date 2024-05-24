import './Sidebar.css'
import { useDispatch } from 'react-redux'

import { logout } from '../actions/userActions'
import { Link } from 'react-router-dom'
const Sidebar = ({ sidebarOpen, closeSidebar }) => {
  const dispatch = useDispatch()

  const logoutHandler = () => {
    console.log('hello')
    dispatch(logout())
  }
  return (
    <div className={sidebarOpen ? 'sidebar_responsive' : ''} id='sidebar'>
      <div className='sidebar__title'>
        <div className='sidebar__img'>
      
        </div>
        <i
          onClick={() => closeSidebar()}
          className='fa fa-times'
          id='sidebarIcon'
          aria-hidden='true'
        ></i>
      </div>

      <div className='sidebar__menu'>
        <div className='sidebar__link active_menu_link'>
          <i className='fa fa-home'></i>
          <Link className='linked' to='/'>
            Dashboard
          </Link>
        </div>
        <h2>CommitteeMembers Section</h2>
        <div className='sidebar__link'>
          <i className='fa fa-male' aria-hidden='true'></i>
          <Link className='linked' to='/committeeMember-register'>
            CommitteeMember Registration
          </Link>
        </div>
        {/* <div className='sidebar__link'>
          <i className='fa fa-coins'></i>
          <Link className='linked' to='/committeeMember-fee'>
            CommitteeMember Fees
          </Link>
        </div> */}
        <div className='sidebar__link'>
          <i className='fas fa-info'></i>
          <Link className='linked' to='/committeeMember_details'>
            CommitteeMember Details
          </Link>
        </div>
        {/* <div className='sidebar__link'>
          <i className='fas fa-school'></i>
          <Link className='linked' to='/committeeMember-attendance'>
            CommitteeMember Attendance
          </Link>
        </div>
        <div className='sidebar__link'>
          <i className='far fa-sticky-note'></i>
          <Link className='linked' to='/admit_card'>
            Admit Card
          </Link>
        </div> */}
        <h2>Chairpersons Section</h2>
        <div className='sidebar__link'>
          <i className='fa fa-male'></i>
          <Link className='linked' to='/chairperson_register'>
            Chairperson Registration
          </Link>
        </div>
        {/* <div className='sidebar__link'>
          <i className='fa fa-coins'></i>
          <Link className='linked' to='/chairperson_salary'>
            Chairperson Salary
          </Link>
        </div> */}
        <div className='sidebar__link'>
          <i className='fas fa-info'></i>
          <Link className='linked' to='/chairperson_details'>
            Chairperson Details
          </Link>
        </div>
        {/* <div className='sidebar__link'>
          <i className='fas fa-school'></i>
          <Link className='linked' to='chairperson_attendance'>
            Chairperson Attendance
          </Link>
        </div> */}
        <h2>Hods Section</h2>
        <div className='sidebar__link'>
          <i className='fa fa-coins'></i>
          <Link className='linked' to='/non-teaching_hod_register'>
            Hod Registration
          </Link>
        </div>
        {/* <div className='sidebar__link'>
          <i className='fa fa-coins'></i>
          <Link className='linked' to='non-teaching_hod_salary'>
            Salary
          </Link>
        </div> */}
        <div className='sidebar__link'>
          <i className='fas fa-info'></i>
          <Link className='linked' to='/non-teaching_hod_details'>
            Details
          </Link>
        </div>
        {/* <div className='sidebar__link'>
          <i className='fas fa-school'></i>
          <Link className='linked' to='/non-teaching_hod_attendance'>
            Attendance
          </Link>
        </div> */}
        <div className='sidebar__logout'>
          <i className='fa fa-power-off'></i>
          <Link className='linked' onClick={logoutHandler} to='/login'>
            Log out
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
