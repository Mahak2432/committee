  import React, { useState, useEffect } from 'react';
  import { useSelector, useDispatch } from 'react-redux';
  import Loader from '../components/Loader';
  import Message from '../components/Message';
  import axios from 'axios';
  import { classlistCommitteeMember, deleteCommitteeMember } from '../actions/committeeMemberActions';
  import './ChairpersonMain.css';
  import Footer from './Footer';

  const ChairpersonMain = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [meetings, setMeetings] = useState([]);
    const [loadingMeetings, setLoadingMeetings] = useState(false);
    const [errorMeetings, setErrorMeetings] = useState(null);

    const userLogin = useSelector((state) => state.userLogin);
    const { userCred } = userLogin;

    const dispatch = useDispatch();

    const committeeMemberClassList = useSelector((state) => state.committeeMemberClassList);
    const { loading: loadingMembers, committeeMembers, error } = committeeMemberClassList;

    const committeeMemberDelete = useSelector((state) => state.committeeMemberDelete);
    const { loading: loadingDelete, success: successDelete, error: errorDelete } = committeeMemberDelete;

    useEffect(() => {
      console.log('User Credentials:', userCred);
    }, [userCred]);

    useEffect(() => {
      const fetchItems = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get('/dashboard');
          setItems(data);
        } catch (error) {
          console.error('Error fetching data', error);
        } finally {
          setLoading(false);
        }
      };
      fetchItems();
    }, []);

    useEffect(() => {
      if (userCred?.subjectToTeach) {
        dispatch(classlistCommitteeMember(userCred.subjectToTeach));
      }
    }, [dispatch, userCred, successDelete]);

    const deleteHandler = (id) => {
      if (window.confirm('Are you sure?')) {
        dispatch(deleteCommitteeMember(id));
      }
    };

    useEffect(() => {
      const fetchMeetings = async () => {
        setLoadingMeetings(true);
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${userCred.token}`,
            },
          };
          const { data } = await axios.get('/api/meetings', config);
          const filteredMeetings = data.filter((meeting) =>
            userCred.subjectToTeach.includes(meeting.committee)
          );
          setMeetings(filteredMeetings);
        } catch (error) {
          setErrorMeetings(error.response && error.response.data.message
            ? error.response.data.message
            : error.message);
        } finally {
          setLoadingMeetings(false);
        }
      };
      fetchMeetings();
    }, [userCred]);

    return (
      <main>
        <header>
          <div
            style={{
              padding: '20px',
              backgroundColor: '#f8f8f8',
              borderBottom: '2px solid #ccc',
              marginBottom: '20px',
            }}
          >
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#333',
                textAlign: 'center',
                margin: '0',
              }}
            >
              Committees: {userCred?.subjectToTeach?.join(', ')}
            </h1>
          </div>
        </header>
        <div className='header'>
          {userCred?.subjectToTeach?.map((committee) => (
            <h2 key={committee} onClick={() => window.location.href = `/committeeMember_details/details/${committee}`}>
              {committee}
            </h2>
          ))}
        </div>
        <div className="meetings-section">
          <h2>Meeting Details</h2>
          {loadingMeetings ? (
            <Loader />
          ) : errorMeetings ? (
            <Message variant="danger" className="message-danger">{errorMeetings}</Message>
          ) : meetings.length === 0 ? (
            <Message variant="info" className="message-info">No meeting information available.</Message>
          ) : (
            <table className="meetings-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Committee</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Attendees</th>
                  <th>PDF</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map((meeting) => (
                  <tr key={meeting._id}>
                    <td>{meeting.title}</td>
                    <td>{meeting.committee}</td>
                    <td>{new Date(meeting.startTime).toLocaleString()}</td>
                    <td>{new Date(meeting.endTime).toLocaleString()}</td>
                    <td>{meeting.attendees}</td>
                    <td>
                      <a href={`http://localhost:5000/${meeting.pdf}`} target="_blank" rel="noopener noreferrer">View PDF</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!loading && <Footer />}
      </main>
    );
  };

  export default ChairpersonMain;
