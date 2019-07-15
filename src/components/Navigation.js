import React from 'react'
//
import { Location, Link } from './Router'
import AuthDataContext from '../session/AuthDataContext'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import * as routes from '../constants/routes'

// location.pathname can be either '/some/path' or '/some/path/', but both are actually
// the same route, so to make location matching work for both cases we need to remove the
// trailing slash from the path string (with the exception of the root path, '/')
const cleanPath = path => path.replace(/\/$/, '') || '/'

const getAvailableRoutes = authData => Object.values(routes).filter(route => route.condition(authData))

export default () => (
  <AuthDataContext.Consumer>
    {
      authData => (
        <Location>
          {({ location }) => {
            const availableRoutes = getAvailableRoutes(authData)
            const routeIndex = availableRoutes.findIndex(route => route.path === cleanPath(location.pathname))

            return (
              <Tabs value={(routeIndex >= 0) ? routeIndex : false} component="nav">
                {availableRoutes.map(({ path, label }, index) => (
                  <Tab key={index} component={Link} value={index} to={path} label={label} />
                ))}
              </Tabs>
            )
          }}
        </Location>
      )
    }
  </AuthDataContext.Consumer>
)
