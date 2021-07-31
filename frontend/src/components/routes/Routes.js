import React from 'react'
import { Route, Switch } from 'react-router-dom'

import HomeScreen from '../../screens/HomeScreen'
import LoginScreen from '../../screens/LoginScreen'
import ProfileScreen from '../../screens/ProfileScreen'
import RegisterScreen from '../../screens/RegisterScreen'
import UserListScreen from '../../screens/UserListScreen'
import NotFound from '../NotFound'

import PrivateRoute from './PrivateRoute'
import UserLogHistoryScreen from '../../screens/LogHistoryScreen'
import ForgotPasswordScreen from '../../screens/ForgotPasswordScreen'
import ResetPasswordScreen from '../../screens/ResetPasswordScreen'
import PatientScreen from '../../screens/PatientScreen'
import HistoryScreen from '../../screens/HistoryScreen'
import LaboratoryScreen from '../../screens/LaboratoryScreen'
import HistoryFormScreen from '../../screens/HistoryFormScreen'
import LabRequestScreen from '../../screens/LabRequestScreen'

const Routes = () => {
  return (
    <section className='mx-auto mt-5'>
      <Switch>
        <Route exact path='/' component={HomeScreen} />
        <Route path='/forgotpassword' component={ForgotPasswordScreen} />
        <Route path='/login' component={LoginScreen} />
        <Route path='/register' r component={RegisterScreen} />

        <PrivateRoute
          role={['Admin', 'User']}
          path='/profile'
          component={ProfileScreen}
        />

        <Route
          path='/resetpassword/:resetToken'
          component={ResetPasswordScreen}
        />
        <PrivateRoute
          path='/admin/users/logs'
          role={['Admin']}
          component={UserLogHistoryScreen}
        />
        <PrivateRoute
          exact
          path='/admin/users'
          role={['Admin']}
          component={UserListScreen}
        />
        <PrivateRoute
          path='/admin/users/page/:pageNumber'
          role={['Admin']}
          component={UserListScreen}
        />

        <PrivateRoute
          path='/patient'
          role={['Admin']}
          component={PatientScreen}
        />
        <PrivateRoute
          path='/lab-request'
          role={['Admin']}
          component={LabRequestScreen}
        />

        <PrivateRoute
          exact
          path='/history'
          role={['Admin']}
          component={HistoryScreen}
        />
        <PrivateRoute
          path='/history/form/:id?'
          role={['Admin']}
          component={HistoryFormScreen}
        />
        <PrivateRoute
          path='/laboratory'
          role={['Admin']}
          component={LaboratoryScreen}
        />

        <Route component={NotFound} />
      </Switch>
    </section>
  )
}

export default Routes
