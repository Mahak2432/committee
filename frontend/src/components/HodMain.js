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
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);

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

  const searchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchEmail);
    console.log(chairpersons)
    console.log(committeeMembers)
    if (searchEmail) {
      const chairperson = chairpersons.find((person) => person.email === searchEmail);
      const memberCommittees = committeeMembers.filter((member) => member.email === searchEmail);

      const chairpersonCommittees = chairperson ? chairperson.subjectToTeach : [];
      const memberCommitteeNames = memberCommittees.map((member) => member.classname);

      if (chairperson || memberCommittees.length > 0) {
        setSearchResult({
          name: chairperson ? chairperson.chairperson_name : memberCommittees[0].committeeMember_name,
          email: searchEmail,
          chairpersonCommittees,
          memberCommittees: memberCommitteeNames,
        });
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
          <p>About Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque...</p>
        </section>
      )}
      {visibleSection === 'vision' && (
        <section className='content'>
          <p>Vision Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque...</p>
        </section>
      )}
      {visibleSection === 'achievements' && (
        <section className='content'>
          <p>Achievements ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque...</p>
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
      <div className='search-container'>
        <form onSubmit={searchSubmit}>
          <input
            type='text'
            placeholder='Search by email...'
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
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
                <tr>
                  <td>{searchResult.name}</td>
                  <td>{searchResult.email}</td>
                  <td>{searchResult.chairpersonCommittees.join(', ')}</td>
                  <td>{searchResult.memberCommittees.join(', ')}</td>
                </tr>
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
              <DashboardCard
                key={item?._id}
                takeme={item?.takeme}
                title={item?.title}
                image={item?.image}
              />
            ))}
          </div>
        )}
      </div>
      {!loadingItems && <Footer />}
    </main>
  );
};

export default HodMain;
