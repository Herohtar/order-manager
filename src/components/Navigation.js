import React from 'react'
import { Route, Link, cleanPath } from 'react-static'

import AuthDataContext from '../session/AuthDataContext'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import * as routes from '../constants/routes'

const ConditionalTab = ({ condition, data, path, label }) => (
  condition(data) ?
    <Tab component={Link} value={cleanPath(path)} to={path} label={label} />
    :
    null
)

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
            <ConditionalTab condition={dashboardCondition} data={authData.token} path={routes.DASHBOARD} label="Dashboard" />
            <ConditionalTab condition={accountCondition} data={authData.authUser} path={routes.ACCOUNT} label="Account" />
            <ConditionalTab condition={adminCondition} data={authData.token} path={routes.ADMIN} label="Admin" />
          </Tabs>
        )} />
      )
    }
  </AuthDataContext.Consumer>
)

export default Navigation
