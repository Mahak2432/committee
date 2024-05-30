import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listChairpersons } from '../actions/chairpersonActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { deleteChairperson } from '../actions/chairpersonActions'
import './AllChairpersons.css'

const AllChairpersons = ({}) => {
  const dispatch = useDispatch()
  const chairpersonList = useSelector((state) => state.chairpersonList)
  const { loading, chairpersons, error } = chairpersonList
  const chairpersonDelete = useSelector((state) => state.chairpersonDelete)
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = chairpersonDelete
  // const matchid = match.params.id
  useEffect(() => {
    dispatch(listChairpersons())
  }, [dispatch, successDelete])
  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteChairperson(id))
    }
  }
  var i = 1

  const searchSubmit = (e) => {
    e.preventDefault()
    console.log('clicked')
  }
  // const loading1=true
  // const chairpersons = []
  return (
    <div className='container3'>
      <div className='outer'>
        <input type='text' placeholder='Search for chairperson...' />
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
                  <th>Chairperson Name</th>
                  <th>Qualification</th>
                  <th>Chairperson Id</th>
                  <th>Address</th>
                  <th>Head of Committee</th>
                  <th>Contact No</th>
                  <th>Email</th>
                  <th>Age</th>
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
                {chairpersons.map((data) => (
                  <tr key={data._id} className='contents'>
                    <td>{i++}</td>
                    {/* <td>{data._id}</td> */}
                    <td>
                      <img style={{ height: '50px' }} src={data.image} alt='' />
                    </td>
                    <td>{data.chairperson_name}</td>
                    <td>{data.qualification}</td>
                    <td>{data.chairpersonId}</td>
                    {/* <td>{data.roll_no}</td> */}

                    <td>{data.address}</td>
                    <td>{data.subjectToTeach.join(', ')}</td>
                    <td>{data.contact_no}</td>
                    <td>{data.email}</td>
                    <td>{data.age}</td>

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
                        onClick={() => deleteHandler(data.chairpersonId)}
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

export default AllChairpersons
