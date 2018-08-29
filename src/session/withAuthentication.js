import React from 'react'

import AuthDataContext from './AuthDataContext';
import { auth, firestore } from '../firebase'

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor (props) {
      super(props)

      this.state = {
        authUser: null,
        accountStatus: null,
        token: null,
      }
    }

    componentDidMount () {
      this.unregisterAuthObserver = auth.onAuthStateChanged(async (authUser) => {
        if (this.unregisterTokenObserver) {
          this.unregisterTokenObserver()
        }

        if (authUser) {
          this.unregisterTokenObserver = firestore.collection('userTokens').doc(authUser.uid).onSnapshot(async (tokens) => {
            const accountStatus = tokens.get('accountStatus')
            const forceRefresh = (accountStatus === 'ready')
            const token = await authUser.getIdTokenResult(forceRefresh)
            this.setState(() => ({ authUser, accountStatus, token }))
          })
        } else {
          this.setState(() => ({ authUser: null, accountStatus: null, token: null }));
        }
      })
    }

    componentWillUnmount() {
      this.unregisterTokenObserver();
      this.unregisterAuthObserver();
    }

    render () {
      const { authUser, accountStatus, token } = this.state;

      return (
        <AuthDataContext.Provider value={{ authUser, accountStatus, token }}>
          <Component {...this.props} />
        </AuthDataContext.Provider>
      )
    }
  }

  return WithAuthentication
}

export default withAuthentication
