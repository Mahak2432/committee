import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { PaySalary } from '../actions/hodActions'
import { STAFF_SALARY_RESET } from '../constants/hodConstants'
import './CommitteeMember.css'
const HodSalary = ({ history }) => {
  const [hodname, setHodname] = useState('')
  const [id, setId] = useState('')
  const [valid, setValid] = useState(false)
  const [year, setYear] = useState('')
  const [salary, setSalary] = useState('')
  const [month, setMonth] = useState('')
  const dispatch = useDispatch()
  const submitHandler = (e) => {
    e.preventDefault()
    setValid(true)
    setTimeout(() => {
      setValid(false)
    }, 10000)
    dispatch(PaySalary(hodname.trim(), id, year, month, salary))
    setHodname('')
    setId('')
    setYear('')
    setSalary('')
    setMonth('')
  }
  const userLogin = useSelector((state) => state.userLogin)
  // const userLogin = useSelector((state) => state.userLogin)

  const { userCred } = userLogin

  // const committeeMemberRegister = useSelector((state) => state.committeeMemberRegister)
  const hodSalary = useSelector((state) => state.hodSalary)

  const { loading, success, error } = hodSalary
  useEffect(() => {
    dispatch({
      type: STAFF_SALARY_RESET,
    })
    if (!userCred) {
      history.push('/login')
    }
  }, [userCred, history])
  return (
    <div className='container1' style={{ marginTop: '10px' }}>
      <div className='outer-layout'>
        <h1>Hod Salary Section</h1>
        {valid && success && (
          <Message variant='success' message={success.message} />
        )}
        {valid && error && <Message variant='danger' message={error} />}

        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={submitHandler}>
            <div className='form-inner'>
              <div className='form-control'>
                <label for='name'>Hod Name</label>
                <input
                  type='text'
                  value={hodname}
                  onChange={(e) => setHodname(e.target.value)}
                  required
                />
              </div>
              <div className='form-control'>
                <label for='name'>Hod ID</label>
                <input
                  type='number'
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                />
              </div>
              <div className='form-control'>
                <label for='year'>Salary for Year</label>
                <input
                  type='string'
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>{' '}
              <div className='form-control'>
                <label for='name'>Salary for Month</label>
                <select
                  id='class'
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                >
                  <option value=''>Select Month</option>

                  <option value='Baisakh'>Baisakh</option>
                  <option value='Jestha'>Jestha</option>
                  <option value='Ashadh'>Ashadh</option>
                  <option value='Shrawan'>Shrawan</option>
                  <option value='Bhadra'>Bhadra</option>
                  <option value='Ashoj'>Ashoj</option>
                  <option value='Kartik'>Kartik</option>
                  <option value='Mangsir'>Mangsir</option>
                  <option value='Poush'>Poush</option>
                  <option value='Magh'>Magh</option>
                  <option value='Falgun'>Falgun</option>
                  <option value='Chaitra'>Chaitra</option>
                  {/* <option value='Ten'>Ten</option> */}
                </select>
              </div>{' '}
              <div className='form-control'>
                <label for='name'>Salary Amount</label>
                <input
                  type='number'
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  required
                />
              </div>{' '}
              {/* <div className="register-btn"> */}
              {/* </div> */}
            </div>

            <button className='btn-register' type='submit'>
              Pay Now
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default HodSalary
