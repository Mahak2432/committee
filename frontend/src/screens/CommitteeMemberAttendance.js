import React from 'react'
import { Link } from 'react-router-dom'
import Classes from './classData'

import ClassItems from '../components/ClassItems'
const CommitteeMemberAttendance = () => {
  return (
    <div className='container2'>
      <div className='outer'>
        <h3>Select the Class </h3>

        <div className='classes'>
          {Classes.map((classname) => (
            <ClassItems
              key={classname._id}
              target={`/committeeMember-attendance/${classname.classname}`}
              classid={classname.classname}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CommitteeMemberAttendance
