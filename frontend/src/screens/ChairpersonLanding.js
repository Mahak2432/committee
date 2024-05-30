import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Header from '../components/Header'
import ChairpersonSidebar from '../components/ChairpersonSidebar'
import ChairpersonMain from '../components/ChairpersonMain'
import './Landing.css'

const ChairpersonLanding = ({ history }) => {
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
      <ChairpersonSidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <ChairpersonMain />
    </div>
  )
}

export default ChairpersonLanding
