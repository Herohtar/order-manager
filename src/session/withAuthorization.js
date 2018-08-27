import React from 'react'
import { withRouter } from 'react-static'

import AuthDataContext from './AuthDataContext';
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
        <AuthDataContext.Consumer>
          {
            authData => authData.authUser ? <Component authData={authData} {...this.props} /> : null
          }
        </AuthDataContext.Consumer>
      )
    }
  }

  return withRouter(WithAuthorization)
}

export default withAuthorization
