import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listCommitteeMembers, deleteCommitteeMember } from '../actions/committeeMemberActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const AllCommitteeMembers = () => {
  const dispatch = useDispatch();
  const committeeMemberList = useSelector((state) => state.committeeMemberList);
  const { loading, committeeMembers, error } = committeeMemberList;

  const committeeMemberDelete = useSelector((state) => state.committeeMemberDelete);
  const { loading: loadingDelete, success: successDelete, error: errorDelete } = committeeMemberDelete;

  useEffect(() => {
    dispatch(listCommitteeMembers());
  }, [dispatch, successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteCommitteeMember(id));
    }
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    // Implement search functionality here if needed
  };

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
                  <th>Committees</th>
                  <th>Address</th>
                  <th>Contact No</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {committeeMembers.map((data, index) => (
                  <tr key={data._id} className='contents'>
                    <td>{index + 1}</td>
                    <td>
                      <img style={{ height: '50px' }} src={data.image} alt='' />
                    </td>
                    <td>{data.committeeMember_name}</td>
                    <td>{data.classname.join(', ')}</td>
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
                          cursor: 'pointer',
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
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCommitteeMembers;
