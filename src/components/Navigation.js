import React from 'react'
import { Route, Link, cleanPath } from 'react-static'

import AuthDataContext from '../session/AuthDataContext'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import * as routes from '../constants/routes'

const ConditionalTab = async ({ condition, data, path, label }) => {
  return (await condition(data)) && <Tab component={Link} value={cleanPath(path)} to={path} label={label} />
}

const dashboardCondition = async (authUser) => {
  const token = await authUser.getIdTokenResult()
  return (token.claims.hasAccess === true)
}

const accountCondition = authUser => {
  return !!authUser
}

const adminCondition = authUser => {
  const token = await authUser.getIdTokenResult()
  return (token.claims.admin === true)
}

const Navigation = () => (
  <AuthDataContext.Consumer>
    {
      authData => (
        <Route path="*" render={({ location }) => (
          <Tabs value={cleanPath(location.pathname)} component="nav">
            <Tab component={Link} value={cleanPath(routes.HOME)} exact to={routes.HOME} label="Home" />
            <ConditionalTab condition={dashboardCondition} data={authData.authUser} path={routes.DASHBOARD} label="Dashboard" />
            <ConditionalTab condition={accountCondition} data={authData.authUser} path={routes.ACCOUNT} label="Account" />
            <ConditionalTab condition={adminCondition} data={authData.authUser} path={routes.ADMIN} label="Admin" />
          </Tabs>
        )} />
      )
    }
  </AuthDataContext.Consumer>
)

export default Navigation
