import {
  STAFF_DELETE_FAIL,
  STAFF_DELETE_REQUEST,
  STAFF_DELETE_SUCCESS,
  STAFF_LIST_FAIL,
  STAFF_LIST_REQUEST,
  STAFF_LIST_RESET,
  STAFF_LIST_SUCCESS,
  STAFF_REGISTER_FAIL,
  STAFF_REGISTER_REQUEST,
  STAFF_REGISTER_RESET,
  STAFF_REGISTER_SUCCESS,
  STAFF_SALARY_FAIL,
  STAFF_SALARY_REQUEST,
  STAFF_SALARY_RESET,
  STAFF_SALARY_SUCCESS,
} from '../constants/hodConstants'

export const hodSalaryReducer = (state = {}, action) => {
  switch (action.type) {
    case STAFF_SALARY_REQUEST:
      return { loading: true }
    case STAFF_SALARY_SUCCESS:
      return { loading: false, success: action.payload }
    case STAFF_SALARY_FAIL:
      return { loading: false, error: action.payload }
    case STAFF_SALARY_RESET:
      return {}
    default:
      return state
  }
}

//STAFF REGISTER REDUCER
export const hodRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case STAFF_REGISTER_REQUEST:
      return { loading: true }
    case STAFF_REGISTER_SUCCESS:
      return { loading: false, success: action.payload }
    case STAFF_REGISTER_FAIL:
      return { loading: false, error: action.payload }
    case STAFF_REGISTER_RESET:
      return {}
    default:
      return state
  }
}

export const hodDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case STAFF_DELETE_REQUEST:
      return { loading: true }
    case STAFF_DELETE_SUCCESS:
      return { loading: false, success: action.payload }
    case STAFF_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const hodListReducer = (state = { hods: [] }, action) => {
  switch (action.type) {
    case STAFF_LIST_REQUEST:
      return { loading: true, hods: [] }
    case STAFF_LIST_SUCCESS:
      return { loading: false, hods: action.payload }
    case STAFF_LIST_FAIL:
      return { loading: false, error: action.payload }
    case STAFF_LIST_RESET:
      return {}
    default:
      return state
  }
}
