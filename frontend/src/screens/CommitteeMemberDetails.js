import React, { useState, useEffect } from 'react'
import Classes from './classData'
import axios from 'axios'
import ClassItems from '../components/ClassItems'
const CommitteeMemberDetails = () => {
  console.log(Classes)
  const searchSubmit = (e) => {
    e.preventDefault()
    console.log('clicked')
    // alert("Search icon is clicked.")
  }
  return (
    <div className='container2'>
      <div className='outer'>
        {/* <input type='text' placeholder='Search for committeeMember...' />
        <span className='search-icon' onClick={searchSubmit}>
          <i className='fas fa-search'></i>
        </span> */}
        <h3>Browse By Committee</h3>
        <div className='classes'>
          {Classes.map((classinfo) => (
            <ClassItems
              key={classinfo._id}
              target={`/committeeMember_details/details/${classinfo.classname}`}
              //  target=
              classid={classinfo.classname}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CommitteeMemberDetails
