import React from 'react'
import { Route, Link, cleanPath } from 'react-static'

import AuthDataContext from '../session/AuthDataContext'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import * as routes from '../constants/routes'

const getAvailableRoutes = authData => Object.values(routes).filter(route => route.condition(authData))

const Navigation = () => (
  <AuthDataContext.Consumer>
    {
      authData => (
        <Route path="*" render={({ location }) => {
          const availableRoutes = getAvailableRoutes(authData)
          const routeIndex = availableRoutes.findIndex(route => cleanPath(route.path) === cleanPath(location.pathname))
          
          return (
            <Tabs value={(routeIndex >= 0) ? routeIndex : false} component="nav">
              {availableRoutes.map(({ exact, path, label }, index) => (
                <Tab component={Link} value={index} exact={exact} to={path} label={label} />
              ))}
            </Tabs>
          )
        }} />
      )
    }
  </AuthDataContext.Consumer>
)

export default Navigation
