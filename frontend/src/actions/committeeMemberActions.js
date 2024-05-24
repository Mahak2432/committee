import axios from 'axios'
import {
  STUDENT_LIST_REQUEST,
  STUDENT_LIST_SUCCESS,
  STUDENT_LIST_FAIL,
  STUDENT_CLASS_LIST_REQUEST,
  STUDENT_CLASS_LIST_SUCCESS,
  STUDENT_CLASS_LIST_FAIL,
  STUDENT_SEARCH_REQUEST,
  STUDENT_SEARCH_SUCCESS,
  STUDENT_SEARCH_FAIL,
  STUDENT_REGISTER_REQUEST,
  STUDENT_REGISTER_SUCCESS,
  STUDENT_REGISTER_FAIL,
  STUDENT_DELETE_FAIL,
  STUDENT_DELETE_SUCCESS,
  STUDENT_DELETE_REQUEST,
  STUDENT_ATTENDANCE_FAIL,
  STUDENT_ATTENDANCE_SUCCESS,
  STUDENT_ATTENDANCE_REQUEST,
  STUDENT_FEES_REQUEST,
  STUDENT_FEES_SUCCESS,
  STUDENT_FEES_FAIL,
} from '../constants/committeeMemberConstants'

//the below uses function within a function which is privileged by redux-thunk

export const listCommitteeMembers = () => async (dispatch) => {
  try {
    dispatch({
      type: STUDENT_LIST_REQUEST,
    })
    const { data } = await axios.get('/api/committeeMembers')
    dispatch({
      type: STUDENT_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: STUDENT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
//following displays list of all committeeMembers belonging to the particular class

export const classlistCommitteeMember = (id) => async (dispatch) => {
  try {
    dispatch({
      type: STUDENT_CLASS_LIST_REQUEST,
    })
    const { data } = await axios.get(`/api/committeeMembers/class/${id}`)
    dispatch({
      type: STUDENT_CLASS_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: STUDENT_CLASS_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
//following is for searching the committeeMember for paying the fees

export const committeeMemberSearch = (name, classname, rollno) => async (dispatch) => {
  try {
    dispatch({
      type: STUDENT_SEARCH_REQUEST,
    })
    console.log(name, classname, rollno)
    const { data } = await axios.get(
      `/api/committeeMembers/search/${name}/${classname}/${rollno}`
    )
    console.log('Data is ', data)
    dispatch({
      type: STUDENT_SEARCH_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: STUDENT_SEARCH_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

//committeeMember register

export const Register = (
  committeeMember_name,
  classname,

  address,
  parents_name,

  contact_no,
  gender,
  age,
  email,
  registration_fees,
  image
) => async (dispatch, getState) => {
  try {
    dispatch({
      type: STUDENT_REGISTER_REQUEST,
    })
    //we need to send headers information so we declaring it inside the config
    const {
      userLogin: { userCred },
    } = getState()
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userCred.token}`,
      },
    }
    const { data } = await axios.post(
      '/api/committeeMembers/register',
      {
        committeeMember_name,
        classname,

        address,
        parents_name,

        contact_no,
        gender,
        age,
        email,
        registration_fees,
        image,
      },
      config
    )
    dispatch({
      type: STUDENT_REGISTER_SUCCESS,
      payload: data,
    })
    //we are getting  the json data from our backend request so we need to convert it into the
    //string before we save them in our local storage of our  browser
  } catch (error) {
    dispatch({
      type: STUDENT_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

//FOLLOWING IS FOR DELETING THE STUDENT

export const deleteCommitteeMember = (id) => async (dispatch) => {
  try {
    dispatch({
      type: STUDENT_DELETE_REQUEST,
    })
    const { data } = await axios.delete(`/api/committeeMembers/delete/${id}`)
    dispatch({
      type: STUDENT_DELETE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: STUDENT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

//committeeMember attendacnce

export const committeeMemberAttendances = (classname, committeeMembers) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: STUDENT_ATTENDANCE_REQUEST,
    })
    //we need to send headers information so we declaring it inside the config
    const {
      userLogin: { userCred },
    } = getState()
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userCred.token}`,
      },
    }
    const { data } = await axios.post(
      `/api/committeeMembers/attendance/${classname}`,
      {
        committeeMembers,
      },
      config
    )
    dispatch({
      type: STUDENT_ATTENDANCE_SUCCESS,
      payload: data,
    })
    //we are getting  the json data from our backend request so we need to convert it into the
    //string before we save them in our local storage of our  browser
  } catch (error) {
    dispatch({
      type: STUDENT_ATTENDANCE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

//fees

export const PayFees = (
  committeeMemberId,
  committeeMember_name,

  classname,
  roll_no,
  month_name,
  year,
  monthly_fees,
  hostel_fees,
  laboratory_fees,
  computer_fees,
  exam_fees,
  miscellaneous
) => async (dispatch, getState) => {
  try {
    dispatch({
      type: STUDENT_FEES_REQUEST,
    })
    //we need to send headers information so we declaring it inside the config
    const {
      userLogin: { userCred },
    } = getState()
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userCred.token}`,
      },
    }
    const { data } = await axios.post(
      `/api/committeeMembers/fees/${committeeMemberId}`,
      {
        committeeMember_name,
        classname,
        roll_no,
        month_name,
        year,
        monthly_fees,
        hostel_fees,
        laboratory_fees,
        computer_fees,
        exam_fees,
        miscellaneous,
      },
      config
    )
    dispatch({
      type: STUDENT_FEES_SUCCESS,
      payload: data,
    })
    //we are getting  the json data from our backend request so we need to convert it into the
    //string before we save them in our local storage of our  browser
  } catch (error) {
    dispatch({
      type: STUDENT_FEES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
