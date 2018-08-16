import React from 'react'

import AuthUserContext from './AuthUserContext';
import { auth } from '../firebase'

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor (props) {
      super(props)

      this.state = {
        authUser: null,
      }
    }

    componentDidMount () {
      this.unregisterAuthObserver = auth.onAuthStateChanged(authUser => (
        authUser
          ? this.setState(() => ({ authUser }))
          : this.setState(() => ({ authUser: null }))
      ))
    }

    componentWillUnmount() {
      this.unregisterAuthObserver();
    }

    render () {
      const { authUser } = this.state;

      return (
        <AuthUserContext.Provider value={authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      )
    }
  }

  return WithAuthentication
}

export default withAuthentication
