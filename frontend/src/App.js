import React, { useState } from 'react'
import Landing from './screens/Landing'
// import
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './screens/Login'
import CommitteeMemberRegister from './screens/CommitteeMemberRegister'
import CommitteeMemberDetails from './screens/CommitteeMemberDetails'
import CommitteeMemberDeepDetails from './screens/CommitteeMemberDeepDetails'
import AllCommitteeMembers from './screens/AllCommitteeMembers'
import ChairpersonRegister from './screens/ChairpersonRegister'
import AllChairpersons from './screens/AllChairpersons'
import AllHods from './screens/AllHods'
import HodRegister from './screens/HodRegister'
import NotFound from './screens/NotFound'
import ExpenseScreen from './screens/ExpenseScreen'
import underConstruction from './components/underConstruction'
import PrivateRoute from '../src/utils/PrivateRoute'
import ChairpersonLanding from './screens/ChairpersonLanding'

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <PrivateRoute path='/' component={Landing} exact />
          <Route path='/login' component={Login} exact />
          <PrivateRoute path='/committeeMember-register' component={CommitteeMemberRegister} />
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
          <PrivateRoute path='/committeeMembers' component={AllCommitteeMembers} exact />
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
          <PrivateRoute path='/salary' component={ExpenseScreen} exact />
          <PrivateRoute path='/chairperson_landing' component={ChairpersonLanding} exact />
          <Route component={NotFound} />
          
        </Switch>
      </div>
    </Router>
  )
}

export default App
