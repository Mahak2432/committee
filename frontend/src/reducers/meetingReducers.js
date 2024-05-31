import {
    MEETING_CREATE_REQUEST,
    MEETING_CREATE_SUCCESS,
    MEETING_CREATE_FAIL,
    MEETING_LIST_REQUEST,
    MEETING_LIST_SUCCESS,
    MEETING_LIST_FAIL,
  } from '../constants/meetingConstants';
  
  export const meetingCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case MEETING_CREATE_REQUEST:
        return { loading: true };
      case MEETING_CREATE_SUCCESS:
        return { loading: false, success: true, meeting: action.payload };
      case MEETING_CREATE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const meetingListReducer = (state = { meetings: [] }, action) => {
    switch (action.type) {
      case MEETING_LIST_REQUEST:
        return { loading: true, meetings: [] };
      case MEETING_LIST_SUCCESS:
        return { loading: false, meetings: action.payload };
      case MEETING_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  