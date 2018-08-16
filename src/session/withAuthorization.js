import React from 'react'
import { withRouter } from 'react-static'

import AuthUserContext from './AuthUserContext';
import { auth } from '../firebase'

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount () {
      this.unregisterAuthObserver = auth.onAuthStateChanged(async (authUser) => {
        if (!(await condition(authUser))) {
          this.props.history.push('/')
        }
      })
    }

    componentWillUnmount() {
      this.unregisterAuthObserver();
    }

    render () {
      return (
        <AuthUserContext.Consumer>
          {
            authUser => authUser ? <Component authUser={authUser} {...this.props} /> : null
          }
        </AuthUserContext.Consumer>
      )
    }
  }

  return withRouter(WithAuthorization)
}

export default withAuthorization
