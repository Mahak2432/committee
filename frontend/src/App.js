import React, { useState } from 'react'
import Landing from './screens/Landing'
// import
// import { Button } from 'react-bootstrap'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './screens/Login'
import CommitteeMemberRegister from './screens/CommitteeMemberRegister'
import CommitteeMemberFees from './screens/CommitteeMemberFees'
import CommitteeMemberDetails from './screens/CommitteeMemberDetails'
import CommitteeMemberDeepDetails from './screens/CommitteeMemberDeepDetails'
import CommitteeMemberAttendance from './screens/CommitteeMemberAttendance'
import AllCommitteeMembers from './screens/AllCommitteeMembers'
import CommitteeMemberClassAdmitCard from './screens/CommitteeMemberClassAdmitCard'
import CommitteeMemberClassAdmitCardDeep from './screens/CommitteeMemberClassAdmitCardDeep'
import ChairpersonSalary from './screens/ChairpersonSalary'
import HodSalary from './screens/HodSalary'
import ChairpersonRegister from './screens/ChairpersonRegister'
import AllChairpersons from './screens/AllChairpersons'
import AllHods from './screens/AllHods'
import HodRegister from './screens/HodRegister'
import IncomeScreen from './screens/IncomeScreen'
import NotFound from './screens/NotFound'
import ExpenseScreen from './screens/ExpenseScreen'
import underConstruction from './components/underConstruction'
import PrivateRoute from '../src/utils/PrivateRoute'
// import ExpenseScreen from './screens/ExpenseScreen'

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <PrivateRoute path='/' component={Landing} exact />
          <Route path='/login' component={Login} exact />
          <PrivateRoute path='/committeeMember-register' component={CommitteeMemberRegister} />
          <PrivateRoute path='/committeeMember-fee' component={CommitteeMemberFees} />
          <PrivateRoute
            path='/committeeMember_details'
            component={CommitteeMemberDetails}
            exact
          />
          <PrivateRoute
            path='/committeeMember_details/details/:id'
            component={CommitteeMemberDeepDetails}
            exact
          />
          {/* <PrivateRoute
            path='/committeeMember-attendance'
            component={underConstruction}
            exact
          /> */}
          <PrivateRoute
            path='/chairperson_attendance'
            component={underConstruction}
            exact
          />
          <PrivateRoute
            path='/non-teaching_hod_attendance'
            component={underConstruction}
            exact
          />
          {/* <PrivateRoute
            path='/committeeMember-attendance/:class'
            component={CommitteeMemberDeepAttendance}
            exact
          /> */}
          <PrivateRoute path='/committeeMembers' component={AllCommitteeMembers} exact />
          {/* <PrivateRoute path='/admit_card' component={CommitteeMemberAdmitCard} exact /> */}
          {/* <PrivateRoute
            path='/admit_card/allcommitteeMembers'
            component={AllCommitteeMembersAdmitCard}
            exact
          /> */}
          <PrivateRoute
            path='/admit_card/classes'
            component={CommitteeMemberClassAdmitCard}
            exact
          />
          <PrivateRoute
            path='/admit_card/classes/:id'
            component={CommitteeMemberClassAdmitCardDeep}
            exact
          />
          {/* <PrivateRoute
            path='/admit_card/committeeMember'
            component={ParticularCommitteeMemberAdmitCard}
            exact
          /> */}
          <PrivateRoute
            path='/chairperson_salary'
            component={ChairpersonSalary}
            exact
          />
          <PrivateRoute
            path='/chairperson_register'
            component={ChairpersonRegister}
            exact
          />
          <PrivateRoute path='/chairperson_details' component={AllChairpersons} exact />
          <PrivateRoute
            path='/non-teaching_hod_details'
            component={AllHods}
            exact
          />
          <PrivateRoute
            path='/non-teaching_hod_register'
            component={HodRegister}
            exact
          />
          <PrivateRoute
            path='/non-teaching_hod_salary'
            component={HodSalary}
            exact
          />
          <PrivateRoute path='/income' component={IncomeScreen} exact />
          <PrivateRoute path='/salary' component={ExpenseScreen} exact />
          <PrivateRoute
            path='/committeeMember-attendance'
            component={CommitteeMemberAttendance}
            exact
          />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
