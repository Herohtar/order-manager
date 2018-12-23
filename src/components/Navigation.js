import React from 'react'
import { Location, Link } from '@reach/router'
//
import AuthDataContext from '../session/AuthDataContext'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import * as routes from '../constants/routes'

const getAvailableRoutes = authData => Object.values(routes).filter(route => route.condition(authData))

const Navigation = () => (
  <AuthDataContext.Consumer>
    {
      authData => (
        <Location>
          {({ location }) => {
            const availableRoutes = getAvailableRoutes(authData)
            const routeIndex = availableRoutes.findIndex(route => route.path === location.pathname)

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

export default Navigation
