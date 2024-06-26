import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listChairpersons, deleteChairperson } from '../actions/chairpersonActions';
import { listCommitteeMembers } from '../actions/committeeMemberActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import './AllChairpersons.css';

const AllChairpersons = () => {
  const dispatch = useDispatch();

  const chairpersonList = useSelector((state) => state.chairpersonList);
  const { loading: loadingChairpersons, chairpersons, error: errorChairpersons } = chairpersonList;

  const chairpersonDelete = useSelector((state) => state.chairpersonDelete);
  const { loading: loadingDelete, success: successDelete, error: errorDelete } = chairpersonDelete;

  const committeeMemberList = useSelector((state) => state.committeeMemberList);
  const { loading: loadingCommitteeMembers, committeeMembers, error: errorCommitteeMembers } = committeeMemberList;

  const [committeeNames, setCommitteeNames] = useState({});

  useEffect(() => {
    dispatch(listChairpersons());
    dispatch(listCommitteeMembers());
  }, [dispatch, successDelete]);

  useEffect(() => {
    if (chairpersons && committeeMembers) {
      const names = {};
      chairpersons.forEach((chairperson) => {
        // Find committees where the chairperson is also a member
        const members = committeeMembers.filter((member) => member.email === chairperson.email);

        const memberRoles = members.flatMap((member) => 
          member.committees.map((committee) => `${committee.committee_name} - ${committee.role}`)
        );

        const chairpersonRoles = chairperson.subjectToTeach.map((committee) => `${committee} - Chairperson`);

        names[chairperson.email] = [...new Set([...chairpersonRoles, ...memberRoles])].join('\n');
      });
      setCommitteeNames(names);
    }
  }, [chairpersons, committeeMembers]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteChairperson(id));
    }
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    console.log('clicked');
  };

  let i = 1;

  return (
    <div className='container3'>
      <div className='outer'>
      <h1><b>ALL CHAIRPERSONS</b></h1>

        <div className='table-layout'>
          {loadingChairpersons || loadingCommitteeMembers ? (
            <Loader />
          ) : errorChairpersons ? (
            <Message variant='danger' message={errorChairpersons} />
          ) : errorCommitteeMembers ? (
            <Message variant='danger' message={errorCommitteeMembers} />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Photo</th>
                  <th>Chairperson Name</th>
                  <th>Qualification</th>
                  <th>Address</th>
                  <th>Committees and Roles</th>
                  <th>Contact No</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {chairpersons.map((data) => (
                  <tr key={data._id} className='contents'>
                    <td>{i++}</td>
                    <td>
                      <img style={{ height: '50px' }} src={data.image} alt='' />
                    </td>
                    <td>{data.chairperson_name}</td>
                    <td>{data.qualification}</td>
                    <td>{data.address}</td>
                    <td>
                      <div style={{ whiteSpace: 'pre-line' }}>
                        {committeeNames[data.email]}
                      </div>
                    </td>
                    <td>{data.contact_no}</td>
                    <td>{data.email}</td>
                    <td>{data.age}</td>
                    <td>{data.gender}</td>
                    <td>
                      <i
                        style={{ padding: '8px', color: 'red', fontSize: '25px', cursor: 'pointer' }}
                        onClick={() => deleteHandler(data.chairpersonId)}
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

export default AllChairpersons;
