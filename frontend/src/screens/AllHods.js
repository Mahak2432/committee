import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listHods } from '../actions/hodActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { deleteHod } from '../actions/hodActions'

const AllHods = ({}) => {
  const dispatch = useDispatch()
  const hodList = useSelector((state) => state.hodList)
  const { loading, hods, error } = hodList
  const hodDelete = useSelector((state) => state.hodDelete)
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = hodDelete
  // const matchid = match.params.id
  useEffect(() => {
    dispatch(listHods())
  }, [dispatch, successDelete])
  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteHod(id))
    }
  }
  var i = 1

  const searchSubmit = (e) => {
    e.preventDefault()
    console.log('clicked')
  }
  // const loading1=true
  // const hods = []
  return (
    <div className='container3'>
      <div className='outer'>
      <h1><b>ALL HODs</b></h1>

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
                  <th>Hod Name</th>
                  <th>Qualification</th>
                  <th>Hod Id</th>
                  <th>Address</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Contact No</th>
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
                {hods.map((data) => (
                  <tr key={data._id} className='contents'>
                    <td>{i++}</td>
                    {/* <td>{data._id}</td> */}
                    <td>
                      <img style={{ height: '50px' }} src={data.image} alt='' />
                    </td>
                    <td>{data.hod_name}</td>
                    <td>{data.qualification}</td>
                    <td>{data.hodId}</td>
                    {/* <td>{data.roll_no}</td> */}

                    <td>{data.address}</td>
                    <td>{data.work}</td>
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
                        onClick={() => deleteHandler(data.hodId)}
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

export default AllHods
