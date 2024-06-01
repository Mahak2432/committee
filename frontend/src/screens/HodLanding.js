import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Header from '../components/Header'
import HodSidebar from '../components/HodSidebar'
import HodMain from '../components/HodMain'
import './Landing.css'

const HodLanding = ({ history }) => {
  const [sidebarOpen, setsidebarOpen] = useState(false)
  const userLogin = useSelector((state) => state.userLogin)
  const { userCred } = userLogin
  const openSidebar = () => {
    setsidebarOpen(true)
  }
  const closeSidebar = () => {
    setsidebarOpen(false)
  }

  return (
    <div className='containers'>
      <Header sidebarOpen={sidebarOpen} openSidebar={openSidebar} />
      <HodSidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <HodMain />
    </div>
  )
}

export default HodLanding
