import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { deleteCommitteeMember, classlistCommitteeMember } from '../actions/committeeMemberActions';
import Classes from './classData.js';

const CommitteeMemberDetails = ({ match }) => {
  const matchid = match.params.id;

  const dispatch = useDispatch();
  const committeeMemberClassList = useSelector((state) => state.committeeMemberClassList);
  const { loading, committeeMembers, error } = committeeMemberClassList;
  const committeeMemberDelete = useSelector((state) => state.committeeMemberDelete);
  const { loading: loadingDelete, success: successDelete, error: errorDelete } = committeeMemberDelete;

  useEffect(() => {
    dispatch(classlistCommitteeMember(matchid));
  }, [dispatch, matchid, successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteCommitteeMember(id));
    }
  };

  const committee = Classes.find((c) => c.classname.toString() === matchid);

  const [activeSection, setActiveSection] = useState('');

  const handleSectionToggle = (section) => {
    setActiveSection((prevSection) => (prevSection === section ? '' : section));
  };

  return (
    <div className="container3">
      <div className="outer">
        <div className="committee-info" style={{ textAlign: 'center', margin: '20px 0' }}>
          <h2 style={{ marginBottom: '20px' }}>{committee.classname}</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={() => handleSectionToggle('about')} style={buttonStyle}>
              About Us
            </button>
            <button onClick={() => handleSectionToggle('vision')} style={buttonStyle}>
              Vision
            </button>
            <button onClick={() => handleSectionToggle('achievements')} style={buttonStyle}>
              Achievements
            </button>
          </div>
          {activeSection === 'about' && (
            <div style={contentStyle}>
              <p><strong>About us:</strong> {committee.description}</p>
            </div>
          )}
          {activeSection === 'vision' && (
            <div style={contentStyle}>
              <p><strong>Vision:</strong> {committee.vision}</p>
            </div>
          )}
          {activeSection === 'achievements' && (
            <div style={contentStyle}>
              <p><strong>Achievements:</strong> {committee.achievements}</p>
            </div>
          )}
        </div>
        <div className="table-layout">
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger" message={error} />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Photo</th>
                  <th>CommitteeMember Name</th>
                  <th>Committees and Roles</th>
                  <th>Address</th>
                  <th>Contact No</th>
                  <th>Email Address</th>
                  <th>Gender</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {committeeMembers.map((data, index) => (
                  <tr key={data._id} className="contents">
                    <td>{index + 1}</td>
                    <td>
                      <img style={{ height: '50px' }} src={data.image} alt="" />
                    </td>
                    <td>{data.committeeMember_name}</td>
                    <td>
                      {data.committees.map((committee) => (
                        <div key={committee._id}>
                          {committee.committee_name} - {committee.role}
                        </div>
                      ))}
                    </td>
                    <td>{data.address}</td>
                    <td>{data.contact_no}</td>
                    <td>{data.email}</td>
                    <td>{data.gender}</td>
                    <td>
                      <i
                        style={{
                          padding: '8px',
                          color: 'red',
                          cursor: 'pointer',
                          fontSize: '25px',
                        }}
                        onClick={() => deleteHandler(data._id)}
                        className="fas fa-trash"
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

const buttonStyle = {
  padding: '10px 20px',
  cursor: 'pointer',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  outline: 'none',
  transition: 'background-color 0.3s',
};

const contentStyle = {
  marginTop: '20px',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  backgroundColor: '#f9f9f9',
  textAlign: 'left',
};

export default CommitteeMemberDetails;
