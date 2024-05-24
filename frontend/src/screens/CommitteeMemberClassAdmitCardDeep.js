import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listCommitteeMembers } from '../actions/committeeMemberActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { AdmitCard } from '../components/AdmitCard'
import { classlistCommitteeMember } from '../actions/committeeMemberActions'
import './admitcard.css'
import { STUDENT_CLASS_LIST_CLEAR } from '../constants/committeeMemberConstants'
// import CommitteeMemberClassAdmitCard from './CommitteeMemberClassAdmitCard'
const CommitteeMemberClassAdmitCardDeep = ({ match }) => {
  const matchid = match.params.id

  const dispatch = useDispatch()
  const committeeMemberClassList = useSelector((state) => state.committeeMemberClassList)
  const { loading, committeeMembers, error } = committeeMemberClassList

  const Print = () => {
    window.print()
  }
  useEffect(() => {
    dispatch({
      type: STUDENT_CLASS_LIST_CLEAR,
    })
    dispatch(classlistCommitteeMember(matchid))
  }, [dispatch])
  return (
    <div className='container1'>
      <div className='exam'></div>
      {loading && <Loader />}
      {error && <Message variant='danger' message={error} />}
      {committeeMembers &&
        committeeMembers.map((committeeMember) => (
          <div key={committeeMember._id} className='arrange'>
            <AdmitCard
              examination='Terminal Examination'
              name={committeeMember.committeeMember_name}
              classname={committeeMember.classname}
              rollno={committeeMember.roll_no}
              image={committeeMember.image}
            />
          </div>
        ))}
      {committeeMembers && (
        <div className='la'>
          <button onClick={Print} className='printcmd'>
            Print All
          </button>
        </div>
      )}
    </div>
  )
}

export default CommitteeMemberClassAdmitCardDeep
