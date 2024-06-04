import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import axios from 'axios';
import { classlistCommitteeMember, deleteCommitteeMember } from '../actions/committeeMemberActions';
import { listChairpersons } from '../actions/chairpersonActions';
import './HodMain.css';
import DashboardCard from './DashboardCard';
import Footer from './Footer';
import { listCommitteeMembers } from '../actions/committeeMemberActions';

const HodMain = () => {
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [visibleSection, setVisibleSection] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loadingMeetings, setLoadingMeetings] = useState(false);
  const [errorMeetings, setErrorMeetings] = useState(null);
  const [selectedCommittee, setSelectedCommittee] = useState('');

  const userLogin = useSelector((state) => state.userLogin);
  const { userCred } = userLogin;

  const dispatch = useDispatch();
  const chairpersonList = useSelector((state) => state.chairpersonList);
  const { loading: loadingChairpersons, chairpersons, error: errorChairpersons } = chairpersonList;

  const chairpersonDelete = useSelector((state) => state.chairpersonDelete);
  const { loading: loadingDelete, success: successDelete, error: errorDelete } = chairpersonDelete;

  const committeeMemberList = useSelector((state) => state.committeeMemberList);
  const { loading: loadingCommitteeMembers, committeeMembers, error: errorCommitteeMembers } = committeeMemberList;

  useEffect(() => {
    console.log('User Credentials:', userCred);
  }, [userCred]);

  useEffect(() => {
    const fetchItems = async () => {
      setLoadingItems(true);
      try {
        const { data } = await axios.get('/dashboard');
        setItems(data);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoadingItems(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    if (userCred?.hod_name) {
      dispatch(listChairpersons());
      dispatch(listCommitteeMembers());
    }
  }, [dispatch, userCred, successDelete]);

  const toggleSection = (section) => {
    setVisibleSection(visibleSection === section ? null : section);
  };

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteCommitteeMember(id));
    }
  };

  const committeeOptions = [
    { value: 'Admissions Committee', label: 'Admissions Committee' },
    { value: 'Examination Committee', label: 'Examination Committee' },
    { value: 'Lab Committee', label: 'Lab Committee' },
    { value: 'Placement Cell Committee', label: 'Placement Cell Committee' },
    { value: 'Department Advisory Committee', label: 'Department Advisory Committee' },
    { value: 'Research Committee', label: 'Research Committee' },
    { value: 'Cultural Committee', label: 'Cultural Committee' },
    { value: 'Sports Committee', label: 'Sports Committee' },
    { value: 'Library Committee', label: 'Library Committee' },
    { value: 'Disciplinary Committee', label: 'Disciplinary Committee' },
  ];

  const fetchMeetings = async (committee) => {
    setLoadingMeetings(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userCred.token}`,
        },
      };
      const { data } = await axios.get('/api/meetings', config);
      const filteredMeetings = data.filter((meeting) =>
        meeting.committee.includes(committee)
      );
      setMeetings(filteredMeetings);
    } catch (error) {
      setErrorMeetings(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    } finally {
      setLoadingMeetings(false);
    }
  };
  const handleCommitteeChange = (e) => {
    const selectedCommittee = e.target.value;
    setSelectedCommittee(selectedCommittee);
    fetchMeetings(selectedCommittee);
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchName);

    if (searchName) {
      const matchedChairpersons = chairpersons.filter(
        (person) => person.chairperson_name.toLowerCase() === searchName.toLowerCase()
      );

      const matchedCommitteeMembers = committeeMembers.filter(
        (member) => member.committeeMember_name.toLowerCase() === searchName.toLowerCase()
      );

      const results = {};

      matchedChairpersons.forEach((person) => {
        if (results[person.email]) {
          results[person.email].chairpersonCommittees = person.subjectToTeach.map((subject) => `${subject} - Chairperson`).join('\n');
        } else {
          results[person.email] = {
            name: person.chairperson_name,
            email: person.email,
            chairpersonCommittees: person.subjectToTeach.map((subject) => `${subject} - Chairperson`).join('\n'),
            memberCommitteeDetails: '',
          };
        }
      });

      matchedCommitteeMembers.forEach((member) => {
        if (results[member.email]) {
          results[member.email].memberCommitteeDetails += results[member.email].memberCommitteeDetails
            ? '\n' + member.committees.map((committee) => `${committee.committee_name} - ${committee.role}`).join('\n')
            : member.committees.map((committee) => `${committee.committee_name} - ${committee.role}`).join('\n');
        } else {
          results[member.email] = {
            name: member.committeeMember_name,
            email: member.email,
            chairpersonCommittees: '',
            memberCommitteeDetails: member.committees.map((committee) => `${committee.committee_name} - ${committee.role}`).join('\n'),
          };
        }
      });

      if (Object.keys(results).length > 0) {
        setSearchResult(Object.values(results));
      } else {
        setSearchResult(null);
      }
    }
  };


  return (
    <main>
      <div className='header'>
        <h2 onClick={() => toggleSection('about')}>About Us</h2>
        <h2 onClick={() => toggleSection('vision')}>Vision</h2>
        <h2 onClick={() => toggleSection('achievements')}>Achievements</h2>
      </div>
      {visibleSection === 'about' && (
        <section className='content'>
          <p>Welcome to the Computer Science and Engineering department at [Your University/Institution]. We're a dynamic community dedicated to pushing the boundaries of computing through education, research, and innovation. Join us as we explore the exciting world of technology and prepare the next generation of computer scientists and engineers.</p>
        </section>
      )}
      {visibleSection === 'vision' && (
        <section className='content'>
          <p>Our vision is to be a global leader in computer science and engineering, driving innovation, advancing knowledge, and making a positive impact on society. We're committed to excellence, diversity, and ethical leadership as we strive to shape the future of technology.</p>
        </section>
      )}
      {visibleSection === 'achievements' && (
        <section className='content'>
          <p>At Bit Mesra CSE department, we're proud of our achievements. From groundbreaking research to student success stories, our department has made waves in the world of technology. Join us and be part of a community that's making a difference through innovation and excellence.</p>
        </section>
      )}
      {userCred?.subjectToTeach && (
        <section className='content'>
          <h2>Committee Members</h2>
          {loadingCommitteeMembers || loadingChairpersons ? (
            <Loader />
          ) : errorCommitteeMembers ? (
            <Message variant='danger' message={errorCommitteeMembers} />
          ) : errorChairpersons ? (
            <Message variant='danger' message={errorChairpersons} />
          ) : (
            <div className='table-layout'>
              <table>
                <thead>
                  <tr>
                    <th>SN</th>
                    <th>Photo</th>
                    <th>Committee Member Name</th>
                    <th>Committee</th>
                    <th>Address</th>
                    <th>Contact No</th>
                    <th>Email Address</th>
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
                            cursor: 'pointer',
                            fontSize: '25px',
                          }}
                          onClick={() => deleteHandler(data._id)}
                          className='fas fa-trash'
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
      <div className='dropdown-container'>
        <select value={selectedCommittee} onChange={handleCommitteeChange}>
          <option value=''>Select Committee For meetging Details .</option>
          {committeeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {selectedCommittee && (
        <section className='content'>
          <h2>{selectedCommittee} Meetings</h2>
          {loadingMeetings ? (
            <Loader />
          ) : errorMeetings ? (
            <Message variant='danger' message={errorMeetings} />
          ) : (
            <div className='table-layout'>
              <table>
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
            </div>
          )}
        </section>
      )}
      <div className='search-container'>
        <form onSubmit={searchSubmit}>
          <input
            type='text'
            placeholder='Search by name...'
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <button type='submit'>Search</button>
        </form>
      </div>
      {searchResult && (
        <section className='content'>
          <h2>Search Results</h2>
          <div className='table-layout'>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Chairperson Committees</th>
                  <th>Member Committees</th>
                </tr>
              </thead>
              <tbody>
                {searchResult.map((result, index) => (
                  <tr key={index}>
                    <td>{result.name}</td>
                    <td>{result.email}</td>
                    <td style={{ whiteSpace: 'pre-wrap' }}>{result.chairpersonCommittees}</td>
                    <td style={{ whiteSpace: 'pre-wrap' }}>{result.memberCommitteeDetails}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className='main__container'>
        {loadingItems ? (
          <Loader />
        ) : (
          <div className='card-handler'>
            {items.slice(0, 4).map((item) => (
              item?.title !== 'Hods' && (
                <DashboardCard
                  key={item?._id}
                  takeme={item?.takeme}
                  title={item?.title}
                  image={item?.image}
                />
              )
            ))}
          </div>

        )}
      </div>
      {!loadingItems && <Footer />}
    </main>
  );
};

export default HodMain;
