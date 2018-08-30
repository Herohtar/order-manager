import React from 'react'
import { Route, Link, cleanPath } from 'react-static'

import AuthDataContext from '../session/AuthDataContext'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import * as routes from '../constants/routes'

const dashboardCondition = authToken => {
  return !!authToken && (authToken.claims.hasAccess === true)
}

const accountCondition = authUser => {
  return !!authUser
}

const adminCondition = authToken => {
  return !!authToken && (authToken.claims.admin === true)
}

const Navigation = () => (
  <AuthDataContext.Consumer>
    {
      authData => (
        <Route path="*" render={({ location }) => (
          <Tabs value={cleanPath(location.pathname)} component="nav">
            <Tab component={Link} value={cleanPath(routes.HOME)} exact to={routes.HOME} label="Home" />
            {dashboardCondition(authData.token) ?
              <Tab component={Link} value={cleanPath(routes.DASHBOARD)} to={routes.DASHBOARD} label="Dashboard" />
              :
              null
            }
            {adminCondition(authData.token) ?
              <Tab component={Link} value={cleanPath(routes.ADMIN)} to={routes.ADMIN} label="Admin" />
              :
              null
            }
            {accountCondition(authData.authUser) ?
              <Tab component={Link} value={cleanPath(routes.ACCOUNT)} to={routes.ACCOUNT} label="Account" />
              :
              null
            }
          </Tabs>
        )} />
      )
    }
  </AuthDataContext.Consumer>
)

export default Navigation
