import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { classlistCommitteeMember, committeeMemberAttendances } from '../actions/committeeMemberActions'
import { STUDENT_ATTENDANCE_RESET } from '../constants/committeeMemberConstants'
import NepaliDate from 'nepali-date-converter'
import Loader from '../components/Loader'
import Message from '../components/Message'
import axios from 'axios'
import './CommitteeMember.css'
const CommitteeMemberDeepAttendance = ({ match }) => {
  const matchid = match.params.class
  const [committeeMemberlist, setCommitteeMemberlist] = useState([])
  const [present, setPresent] = useState({})
  const dispatch = useDispatch()
  const [clicked, setClicked] = useState(false)
  const committeeMemberAttendance = useSelector((state) => state.committeeMemberAttendance)
  const {
    loading: loadingattendance,
    committeeMembers: committeeMembersattendance,
    error: errorattendance,
  } = committeeMemberAttendance
  const committeeMemberClassList = useSelector((state) => state.committeeMemberClassList)
  const { loading, committeeMembers, error } = committeeMemberClassList

  const committeeMembersfinal = committeeMembers && [...committeeMembers]

  // for (i = 0; i < committeeMembersfinal && committeeMembersfinal.length; i++) {
  //   committeeMembersfinal[i].attendance = false
  // }
  useEffect(() => {
    const committeeMembersAttend = async () => {
      const { data } = await axios.get(
        `/api/committeeMembers/class/${matchid}/attendance`
      )
      setCommitteeMemberlist(data.committeeMembers)
      // console.log('attended once', data)
    }
    committeeMembersAttend()
    dispatch({
      type: STUDENT_ATTENDANCE_RESET,
    })
    dispatch(classlistCommitteeMember(matchid))
  }, [dispatch, matchid])
  var i = 1
  const submitAttendance = () => {
    // console.log(committeeMemberlist)
    console.log('committeeMembers list', committeeMembers)
    dispatch(committeeMemberAttendances(matchid, committeeMembers))
  }
  const toggleAttendance = (id) => {
    setPresent((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
    const new_committeeMembers = committeeMembers.filter((datum) => datum._id === id)
    // console.log('new_committeeMembers', new_committeeMembers)
    new_committeeMembers[0].present = !present[id]
    console.log('committeeMembers', committeeMembers)
  }

  return (
    <div className='container1'>
      <div className='attendance-outer'>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
          Attendance for the date of{' '}
          <span style={{ background: 'red' }}>
            {new NepaliDate().format('YYYY-MM-D')}
          </span>{' '}
        </h1>
        {committeeMemberlist.length > 0 && (
          <h3
            style={{ textAlign: 'center', background: 'red', padding: '3px' }}
          >
            Attendance already taken for today
          </h3>
        )}
        {/* {console.log('final committeeMembers', committeeMembersfinal)} */}
        {committeeMembersattendance && (
          <Message variant='success' message={committeeMembersattendance.message} />
        )}
        {errorattendance && (
          <Message variant='danger' message={errorattendance} />
        )}
        <br />
        {loadingattendance && <Loader />}
        {loading ? (
          <loader />
        ) : error ? (
          <Message variant='danger' message={error} />
        ) : (
          <table style={{ margin: 'auto', background: 'green' }}>
            <thead>
              <tr>
                <th>SN</th>
                <th>CommitteeMember Name</th>
                <th>Roll No</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {committeeMemberlist.length > 0
                ? // {  <h1></h1>}
                  committeeMemberlist.map((committeeMember) => (
                    <tr key={committeeMember._id} className='attendance'>
                      <td>{i++}</td>
                      <td>{committeeMember.committeeMember_name}</td>
                      <td>{committeeMember.roll_no}</td>
                      <td
                        onClick={() => toggleAttendance(committeeMember._id)}
                        className={committeeMember.present ? 'present' : 'absent'}
                        style={{ cursor: 'pointer' }}
                      >
                        {committeeMember.present ? 'Present' : 'Absent'}
                      </td>
                    </tr>
                  ))
                : committeeMembersfinal &&
                  committeeMembersfinal.map((committeeMember) => (
                    <tr key={committeeMember._id} className='attendance'>
                      <td>{i++}</td>
                      <td>{committeeMember.committeeMember_name}</td>
                      <td>{committeeMember.roll_no}</td>
                      <td
                        onClick={() => toggleAttendance(committeeMember._id)}
                        className={present[committeeMember._id] ? 'present' : 'absent'}
                        style={{ cursor: 'pointer' }}
                      >
                        {present[committeeMember._id] ? 'Present' : 'Absent'}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        )}
        {committeeMembersfinal && (
          <button
            onClick={submitAttendance}
            style={{ marginTop: '10px', maxWidth: '30%', display: 'block' }}
            disabled={committeeMemberlist.length > 0}
            className={
              committeeMemberlist.length > 0
                ? 'btn-register disable'
                : 'btn-register enable'
            }
          >
            Submit
          </button>
        )}
      </div>
    </div>
  )
}

export default CommitteeMemberDeepAttendance
