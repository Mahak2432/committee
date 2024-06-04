import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Register } from '../actions/committeeMemberActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import './CommitteeMember.css';

const CommitteeMemberRegister = ({ history }) => {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [valid, setValid] = useState(false);
  const [time, setTime] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [committees, setCommittees] = useState([]);
  const [phoneno, setPhoneno] = useState('');
  const [age, setAge] = useState('');
  const [image, setImage] = useState('');

  const uploadFileHandler = async (e) => {
    const { data: CLOUDINARY_URL } = await axios.get('/api/config/cloudinary');
    const { data: CLOUDINARY_UPLOAD_PRESET } = await axios.get('/api/config/cloudinarypreset');

    setTime(true);
    setTimeout(() => {
      setTime(false);
    }, 10000);

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUD_PRESET);

    setUploading(true);
    await axios({
      url: `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formData,
    })
      .then((res) => {
        setImage(res.data.url);
      })
      .catch((err) => {
        console.error(err);
      });
    setUploading(false);
    console.log('url is', image);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setValid(true);
    const formattedCommittees = committees.map((c) => ({
      committee_name: c.committee_name.value,
      role: c.role.value,
    }));
    dispatch(
      Register(
        name.trim(),
        formattedCommittees,
        address,
        phoneno,
        gender,
        age,
        email,
        image
      )
    );
    setName('');
    setAddress('');
    setCommittees([]);
    setTimeout(() => {
      setValid(false);
    }, 10000);
  };

  const userLogin = useSelector((state) => state.userLogin);
  const { userCred } = userLogin;

  const committeeMemberRegister = useSelector((state) => state.committeeMemberRegister);
  const { loading, success, error } = committeeMemberRegister;

  useEffect(() => {
    if (!userCred) {
      history.push('/login');
    }
  }, [userCred, history]);

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

  const roleOptions = [
    { value: 'Convenor', label: 'Convenor' },
    { value: 'Co-Ordinator', label: 'Co-Ordinator' },
    { value: 'Asst. Coordinator', label: 'Asst. Coordinator' },
    { value: 'Member', label: 'Member' },
  ];

  const handleCommitteeChange = (index, selectedOption) => {
    const newCommittees = [...committees];
    newCommittees[index] = { ...newCommittees[index], committee_name: selectedOption };
    setCommittees(newCommittees);
  };

  const handleRoleChange = (index, selectedOption) => {
    const newCommittees = [...committees];
    newCommittees[index] = { ...newCommittees[index], role: selectedOption };
    setCommittees(newCommittees);
  };

  const addCommittee = () => {
    setCommittees([...committees, { committee_name: null, role: null }]);
  };

  const removeCommittee = (index) => {
    const newCommittees = committees.filter((_, i) => i !== index);
    setCommittees(newCommittees);
  };

  return (
    <div className='container1' style={{ marginTop: '10px' }}>
      {loading ? (
        <Loader />
      ) : (
        <div className='outer-layout'>
          <h1>Register Committee member</h1>
          <form onSubmit={submitHandler}>
            <div className='form-inner'>
              <div className='form-control'>
                <label htmlFor='name'>Full Name</label>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className='form-control'>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className='form-control'>
                <label htmlFor='address'>Address</label>
                <input
                  type='text'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className='form-control'>
                <label htmlFor='gender'>Gender</label>
                <select
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value=''>Select Gender</option>
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                  <option value='Others'>Others</option>
                </select>
              </div>
              {committees.map((committee, index) => (
                <div key={index} className='committee-role-pair'>
                  <div className='form-control'>
                    <label htmlFor={`committee-${index}`}>Committee</label>
                    <Select
                      id={`committee-${index}`}
                      options={committeeOptions}
                      value={committee.committee_name}
                      onChange={(selectedOption) => handleCommitteeChange(index, selectedOption)}
                      required
                    />
                  </div>
                  <div className='form-control'>
                    <label htmlFor={`role-${index}`}>Role</label>
                    <Select
                      id={`role-${index}`}
                      options={roleOptions}
                      value={committee.role}
                      onChange={(selectedOption) => handleRoleChange(index, selectedOption)}
                      required
                    />
                  </div>
                  <button type='button' onClick={() => removeCommittee(index)}>Remove</button>
                </div>
              ))}
              <button type='button' className='add-committee-btn' onClick={addCommittee}>Add Committee</button>
              <div className='form-control'>
                <label htmlFor='phoneno'>Phone Number</label>
                <input
                  type='text'
                  value={phoneno}
                  onChange={(e) => setPhoneno(e.target.value)}
                  required
                />
              </div>
              <div className='form-control'>
                <label htmlFor='age'>Age</label>
                <input
                  type='number'
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              <div className='form-control'>
                <label htmlFor='image'>Upload Picture</label>
                <input
                  className='custom-file-input'
                  onChange={uploadFileHandler}
                  type='file'
                  required
                />
                {uploading && <Loader />}
                {time && image && (
                  <Message
                    variant='success'
                    message='Picture uploaded successfully'
                  />
                )}
              </div>
            </div>
            {success && valid && (
              <Message
                style={{ marginBottom: '3px' }}
                variant='success'
                message={success.message}
              />
            )}
            <button className='btn-register' type='submit'>
              Register Committee Member
            </button>
          </form>
          {valid && error && <Message variant='danger' message={error} />}
        </div>
      )}
    </div>
  );
};

export default CommitteeMemberRegister;
