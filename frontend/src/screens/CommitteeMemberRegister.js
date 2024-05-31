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
  const [classname, setClassname] = useState([]);
  const [phoneno, setPhoneno] = useState('');
  const [parentname, setParentname] = useState('');
  const [age, setAge] = useState('');
  const [registrationfees, setRegistraionfees] = useState('');
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
    dispatch(
      Register(
        name.trim(),
        classname.map((c) => c.value),
        address,
        parentname,
        phoneno,
        gender,
        age,
        email,
        registrationfees,
        image
      )
    );
    setName('');
    setAddress('');
    setClassname([]);
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

  const classOptions = [
    { value: 'One', label: 'One' },
    { value: 'Two', label: 'Two' },
    { value: 'Three', label: 'Three' },
    { value: 'Four', label: 'Four' },
    { value: 'Five', label: 'Five' },
    { value: 'Six', label: 'Six' },
    { value: 'Seven', label: 'Seven' },
    { value: 'Eight', label: 'Eight' },
    { value: 'Nine', label: 'Nine' },
    { value: 'Ten', label: 'Ten' }
  ];

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
                <label htmlFor='name'>Email</label>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>{' '}
              <div className='form-control'>
                <label htmlFor='name'>Address</label>
                <input
                  type='text'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>{' '}
              <div className='form-control'>
                <label htmlFor='name'>Gender</label>
                <select
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  {console.log(gender)}
                  <option value=''>Select Gender</option>
                  <option value='Male'>Male</option>

                  <option value='Female'>Female</option>
                  <option value='Others'>Others</option>
                </select>
              </div>{' '}
              <div className='form-control'>
                <label htmlFor='name'>Class</label>
                <Select
                  isMulti
                  options={classOptions}
                  value={classname}
                  onChange={(selectedOptions) => setClassname(selectedOptions)}
                  required
                />
              </div>{' '}
              <div className='form-control'>
                <label htmlFor='name'>Phone Number</label>
                <input
                  type='text'
                  value={phoneno}
                  onChange={(e) => setPhoneno(e.target.value)}
                  required
                />
              </div>{' '}
              {/* <div className='form-control'>
                <label htmlFor='name'>Parent's Name</label>
                <input
                  type='text'
                  value={parentname}
                  onChange={(e) => setParentname(e.target.value)}
                  required
                />
              </div> */}
              {/* <div className='form-control'>
              <label htmlFor='name'>Joining Date</label>
              <input type='date' />
            </div>{' '} */}
              <div className='form-control'>
                <label htmlFor='name'>Age</label>
                <input
                  type='number'
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              {console.log('image url is', image)}
              {/* <div className='form-control'>
                <label htmlFor='registration-fees'>Registration Fees</label>
                <input
                  type='number'
                  value={registrationfees}
                  onChange={(e) => setRegistraionfees(e.target.value)}
                  required
                />
              </div> */}
              <div className='form-control'>
                <label htmlFor='name'>
                  Upload Picture
                  <input
                    className='custom-file-input'
                    onChange={uploadFileHandler}
                    type='file'
                    required
                  />
                </label>
                {uploading && <Loader />}
                {time && image && (
                  <Message
                    variant='success'
                    message='Picture uploaded successfully'
                  />
                )}
              </div>
              {/* <div className="register-btn"> */}
              {/* </div> */}
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
