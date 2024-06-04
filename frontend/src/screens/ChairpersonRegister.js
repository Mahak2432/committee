import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { chairpersonregister } from '../actions/chairpersonActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import './CommitteeMember.css'

const ChairpersonRegister = ({ history }) => {
  const dispatch = useDispatch()
  const [uploading, setUploading] = useState(false)
  const [valid, setValid] = useState(false)
  const [time, setTime] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [previous_school, setPrevious_school] = useState('')
  const [gender, setGender] = useState('')
  const [phoneno, setPhoneno] = useState('')
  const [subjectToTeach, setSubjectToTeach] = useState([])
  const [qualification, setQualification] = useState('')
  const [age, setAge] = useState('')
  const [estimated_salary, setEstimated_salary] = useState('')
  const [image, setImage] = useState('')

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
  ]

  const uploadFileHandler = async (e) => {
    const { data: CLOUDINARY_URL } = await axios.get('/api/config/cloudinary')
    const { data: CLOUDINARY_UPLOAD_PRESET } = await axios.get('/api/config/cloudinarypreset')

    setTime(true)
    setTimeout(() => {
      setTime(false)
    }, 10000)

    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.REACT_APP_CLOUD_PRESET)

    setUploading(true)
    await axios({
      url: `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formData,
    })
      .then((res) => {
        setImage(res.data.url)
      })
      .catch((err) => {
        console.error(err)
      })
    setUploading(false)
    console.log('url is', image)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    setValid(true)
    dispatch(
      chairpersonregister(
        name.trim(),
        qualification,
        address,
        phoneno,
        gender,
        previous_school,
        age,
        email,
        estimated_salary,
        image,
        subjectToTeach.map((option) => option.value) // Map to array of values
      )
    )
    setName('')
    setAddress('')
    setSubjectToTeach([])
    // setImage('')
    setTimeout(() => {
      setValid(false)
    }, 10000)
  }

  const userLogin = useSelector((state) => state.userLogin)
  const { userCred } = userLogin

  const chairpersonRegister = useSelector((state) => state.chairpersonRegister)
  const { loading, success, error } = chairpersonRegister

  useEffect(() => {
    if (!userCred) {
      history.push('/login')
    }
  }, [userCred, history])

  return (
    <div className='container1' style={{ marginTop: '10px' }}>
      {loading ? (
        <Loader />
      ) : (
        <div className='outer-layout'>
          <h1>Register Chairperson</h1>
          {success && valid && (
            <Message style={{ marginBottom: '3px' }} variant='success' message={success.message} />
          )}
          {valid && error && <Message variant='danger' message={error} />}

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
                <label htmlFor='subjectToTeach'>Chairperson of Committees</label>
                <Select
                  isMulti
                  name='subjects'
                  options={committeeOptions}
                  className='basic-multi-select'
                  classNamePrefix='select'
                  value={subjectToTeach}
                  onChange={setSubjectToTeach}
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
                <label htmlFor='qualification'>Qualification</label>
                <input
                  type='text'
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
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
                <label htmlFor='upload-picture'>
                  Upload Picture
                  <input
                    className='custom-file-input'
                    onChange={uploadFileHandler}
                    type='file'
                    required
                  />
                </label>
                {uploading && <Loader />}
                {time && image && <Message variant='success' message='Picture uploaded successfully' />}
              </div>
            </div>
            <button className='btn-register' type='submit'>
              Register Chairperson
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default ChairpersonRegister
