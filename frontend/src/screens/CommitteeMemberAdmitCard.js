import React from 'react'
import { Link } from 'react-router-dom'
const CommitteeMemberAdmitCard = () => {
  return (
    <div className='container1'>
      <div className='admitCard-outer'>
        {/* button is an inline element */}
        <Link className='link' to='/admit_card/allcommitteeMembers'>
          Print admit card of all committeeMembers
        </Link>
        <Link className='link' to='/admit_card/classes'>
          Print admit card of particular class
        </Link>
        <Link className='link' to='/admit_card/committeeMember'>
          Print admit card of particular committeeMember
        </Link>
      </div>
    </div>
  )
}

export default CommitteeMemberAdmitCard
