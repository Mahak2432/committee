import axios from 'axios';
import {
  MEETING_CREATE_REQUEST,
  MEETING_CREATE_SUCCESS,
  MEETING_CREATE_FAIL,
  MEETING_LIST_REQUEST,
  MEETING_LIST_SUCCESS,
  MEETING_LIST_FAIL,
} from '../constants/meetingConstants';

export const createMeeting = (meetingData) => async (dispatch, getState) => {
  try {
    dispatch({ type: MEETING_CREATE_REQUEST });

    const {
      userLogin: { userCred },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userCred.token}`,
      },
    };

    const { data } = await axios.post('/api/meetings', meetingData, config);

    dispatch({
      type: MEETING_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MEETING_CREATE_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

export const listMeetings = () => async (dispatch, getState) => {
  try {
    dispatch({ type: MEETING_LIST_REQUEST });

    const {
      userLogin: { userCred },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userCred.token}`,
      },
    };

    const { data } = await axios.get('/api/meetings', config);

    dispatch({
      type: MEETING_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MEETING_LIST_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};
