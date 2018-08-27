import React from 'react'
import { Route, Link, cleanPath } from 'react-static'

import AuthDataContext from '../session/AuthDataContext'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import * as routes from '../constants/routes'

const Navigation = () => (
  <AuthDataContext.Consumer>
    {
      authData => (
        <Route path="*" render={({ location }) => (
          authData.authUser ? <NavigationAuth location={location} authorized={authData.accountStatus === 'authorized'} /> : <NavigationNonAuth />
        )} />
      )
    }
  </AuthDataContext.Consumer>
)

const NavigationAuth = ({ location, authorized }) => (
  <Tabs value={cleanPath(location.pathname)} component="nav">
    <Tab component={Link} value={cleanPath(routes.HOME)} exact to={routes.HOME} label="Home" />
    {authorized && <Tab component={Link} value={cleanPath(routes.DASHBOARD)} to={routes.DASHBOARD} label="Dashboard" />}
    <Tab component={Link} value={cleanPath(routes.ACCOUNT)} to={routes.ACCOUNT} label="Account" />
  </Tabs>
)

const NavigationNonAuth = ({ location }) => (
  <Tabs value={routes.HOME} component="nav">
    <Tab component={Link} value={routes.HOME} exact to={routes.HOME} label="Home" />
  </Tabs>
)

export default Navigation
