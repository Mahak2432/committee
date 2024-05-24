import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listCommitteeMembers } from '../actions/committeeMemberActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import './admitcard.css'

import { AdmitCard } from '../components/AdmitCard'
import { STUDENT_LIST_CLEAR } from '../constants/committeeMemberConstants'
const AllCommitteeMembersAdmitCard = () => {
  const [examno, setExamno] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
  }
  const dispatch = useDispatch()
  const committeeMemberList = useSelector((state) => state.committeeMemberList)
  const { loading, committeeMembers, error } = committeeMemberList
  const Print = () => {
    window.print()
  }
  useEffect(() => {
    dispatch({
      type: STUDENT_LIST_CLEAR,
    })
    dispatch(listCommitteeMembers())
  }, [dispatch])
  return (
    // const AdmitCard = ({ examination, name, classname, rollno, image }) => {

    <div className='container1'>
      <div className='exam'>
        {/* <form onSubmit={handleSubmit}>
          <input
            className='examNumber'
            type='text'
            value={examno}
            onChange={(e) => setExamno(e.target.value)}
            placeholder='Enter the examination number'
          />
          <button type='submit'>Enter</button>
        </form> */}
      </div>
      {loading ? (
        <Loader />
      ) : (
        committeeMembers &&
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
        ))
      )}
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

export default AllCommitteeMembersAdmitCard
