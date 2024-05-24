//this is the most important file for using the redux as state management tool
//this file should be created directly in the frontend folder
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { committeeMemberListReducer } from './reducers/committeeMemberReducers'
import { userLoginReducer } from './reducers/userReducers'
import {
  committeeMemberClassListReducer,
  committeeMemberSearchReducer,
  committeeMemberRegisterReducer,
  committeeMemberDeleteReducer,
  committeeMemberAttendanceReducer,
  committeeMemberFeesReducer,
} from './reducers/committeeMemberReducers'
import {
  allIncomeReducer,
  allSalaryReducer,
} from './reducers/miscellaneousReducers'
import {
  chairpersonSalaryReducer,
  chairpersonRegisterReducer,
  chairpersonDeleteReducer,
  chairpersonListReducer,
} from './reducers/chairpersonReducers'
import {
  staffSalaryReducer,
  staffRegisterReducer,
  staffDeleteReducer,
  staffListReducer,
} from './reducers/staffReducers'
const reducer = combineReducers({
  committeeMemberList: committeeMemberListReducer,
  committeeMemberClassList: committeeMemberClassListReducer,
  committeeMemberSearch: committeeMemberSearchReducer,
  userLogin: userLoginReducer,
  committeeMemberRegister: committeeMemberRegisterReducer,
  committeeMemberDelete: committeeMemberDeleteReducer,
  committeeMemberAttendance: committeeMemberAttendanceReducer,
  committeeMemberFees: committeeMemberFeesReducer,
  chairpersonSalary: chairpersonSalaryReducer,
  chairpersonRegister: chairpersonRegisterReducer,
  chairpersonDelete: chairpersonDeleteReducer,
  chairpersonList: chairpersonListReducer,
  staffSalary: staffSalaryReducer,
  staffRegister: staffRegisterReducer,
  staffDelete: staffDeleteReducer,
  staffList: staffListReducer,
  allIncome: allIncomeReducer,
  allSalary: allSalaryReducer,
})
const userInfoFromStorage = localStorage.getItem('userCred')
  ? JSON.parse(localStorage.getItem('userCred'))
  : null

//remember the above should be null
const initialState = {
  userLogin: { userCred: userInfoFromStorage },
}
const middleware = [thunk]
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
