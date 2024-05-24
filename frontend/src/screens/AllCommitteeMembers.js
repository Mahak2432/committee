import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listCommitteeMembers } from '../actions/committeeMemberActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { deleteCommitteeMember } from '../actions/committeeMemberActions'

const AllCommitteeMembers = ({  }) => {
  const dispatch = useDispatch()
  const committeeMemberList = useSelector((state) => state.committeeMemberList)
  const { loading, committeeMembers, error } = committeeMemberList
  const committeeMemberDelete = useSelector((state) => state.committeeMemberDelete)
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = committeeMemberDelete
  // const matchid = match.params.id
  useEffect(() => {
    dispatch(listCommitteeMembers())
  }, [dispatch, successDelete])
  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteCommitteeMember(id))
    }
  }
  var i = 1

  const searchSubmit = (e) => {
    e.preventDefault()
    console.log('clicked')
  }
  // const loading1=true
  // const committeeMembers = []
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
                  {/* <th>ID</th> */}
                  <th>Photo</th>
                  <th>CommitteeMember Name</th>
                  <th>Class</th>
                  <th>Roll No</th>
                  <th>Address</th>
                  <th>Parent's Name</th>
                  <th>Contact No</th>
                  <th>Previous Dues</th>
                  <th>Gender</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {/* {match.params.id===data.id && */}
                {/* {console.log(matchid)} */}
                {/* {"A"==="A" ?():(

)} */}
                {/* for displaying the information about the particular class
only we first should have the data of that class only 
. We cannot make selection inside the map method by using double and operator. */}
                {committeeMembers.map((data) => (
                  <tr key={data._id} className='contents'>
                    <td>{i++}</td>
                    {/* <td>{data._id}</td> */}
                    <td>
                      <img style={{ height: '50px' }} src={data.image} alt='' />
                    </td>
                    <td>{data.committeeMember_name}</td>
                    <td>{data.classname}</td>
                    <td>{data.roll_no}</td>
                    <td>{data.address}</td>
                    <td>{data.parents_name}</td>
                    <td>{data.contact_no}</td>
                    <td>{data.previous_dues}</td>
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
                          fontSize: '25px',
                          cursor: 'pointer',
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

export default AllCommitteeMembers
