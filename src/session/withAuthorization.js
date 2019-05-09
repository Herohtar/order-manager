import React from 'react'
//
import { navigate } from '../components/Router'
import AuthDataContext from './AuthDataContext'
import { auth } from '../firebase'

const withAuthorization = condition => Component => (
  class WithAuthorization extends React.Component {
    componentDidMount () {
      this.unregisterAuthObserver = auth.onAuthStateChanged(async (authUser) => {
        if (!(await condition(authUser))) {
          navigate('/', { replace: true })
        }
      })
    }

    componentWillUnmount() {
      this.unregisterAuthObserver()
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
)

export default withAuthorization
