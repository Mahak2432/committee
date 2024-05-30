import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import axios from 'axios';
import { classlistCommitteeMember, deleteCommitteeMember } from '../actions/committeeMemberActions';
import './ChairpersonMain.css';
import DashboardCard from './DashboardCard';
import Footer from './Footer';

const ChairpersonMain = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleSection, setVisibleSection] = useState(null);

  const userLogin = useSelector((state) => state.userLogin);
  const { userCred } = userLogin;

  const dispatch = useDispatch();

  const committeeMemberClassList = useSelector((state) => state.committeeMemberClassList);
  const { loading: loadingMembers, committeeMembers, error } = committeeMemberClassList;

  const committeeMemberDelete = useSelector((state) => state.committeeMemberDelete);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = committeeMemberDelete;

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

  const toggleSection = (section) => {
    setVisibleSection(visibleSection === section ? null : section);
  };

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteCommitteeMember(id));
    }
  };

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
              fontSize: '2.5rem', /* Increase font size */
              fontWeight: 'bold', /* Make the text bold */
              color: '#333', /* Set a dark color for the text */
              textAlign: 'center', /* Center-align the text */
              margin: '0', /* Remove default margin */
            }}
          >
            committee : {userCred?.subjectToTeach}
          </h1>
        </div>
      </header>
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
          {loadingMembers ? (
            <Loader />
          ) : error ? (
            <Message variant='danger' message={error} />
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
      <div className='main__container'>
        {loading ? (
          <Loader />
        ) : (
          <div className='card-handler'>
            {items.map((item) => (
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
      {!loading && <Footer />}
    </main>
  );
};

export default ChairpersonMain;
