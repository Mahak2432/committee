import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { deleteCommitteeMember } from '../actions/committeeMemberActions'
import { classlistCommitteeMember } from '../actions/committeeMemberActions'
const CommitteeMemberDetails = ({ match }) => {
  const matchid = match.params.id

  const dispatch = useDispatch()
  const committeeMemberClassList = useSelector((state) => state.committeeMemberClassList)
  const { loading, committeeMembers, error } = committeeMemberClassList
  const committeeMemberDelete = useSelector((state) => state.committeeMemberDelete)
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = committeeMemberDelete
  useEffect(() => {
    dispatch(classlistCommitteeMember(matchid))
  }, [dispatch, matchid, successDelete])

  var i = 1
  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteCommitteeMember(id))
    }
  }
  const searchSubmit = (e) => {
    e.preventDefault()
    console.log('clicked')
  }
  return (
    <div className='container3'>
      <div className='outer'>
        <input type='text' placeholder='Search for committeeMember...' />
        <span className='search-icon' onClick={searchSubmit}>
          <i className='fas fa-search'></i>
        </span>
        <div className='table-layout'>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger' message={error} />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Photo</th>
                  <th>CommitteeMember Name</th>
                  <th>Committee</th>
                  <th>Address</th>
                  <th>Contact No</th>
                  <th>email address</th>
                  <th>Gender</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {committeeMembers.map((data) => (
                  <tr key={data._id} className='contents'>
                    <td>{i++}</td>
                    <td>
                      <img style={{ height: '50px' }} src={data.image} alt='' />
                    </td>
                    <td>{data.committeeMember_name}</td>
                    <td>{data.classname}</td>
                    <td>{data.address}</td>
                    <td>{data.contact_no}</td>
                    <td>{data.email}</td>
                    <td>{data.gender}</td>
                    <td>
                      <i
                        style={{
                          padding: '8px',
                          color: 'green',
                          fontSize: '25px',
                        }}
                        className='fas fa-user-edit'
                      ></i>
                    </td>
                    <td>
                      <i
                        style={{
                          padding: '8px',
                          color: 'red',
                          cursor:'pointer',
                          fontSize: '25px',
                        }}
                        onClick={() => deleteHandler(data._id)}
                        className='fas fa-trash'
                      ></i>
                    </td>
                  </tr>

                  // }
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommitteeMemberDetails
