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
      }
    }

    componentDidMount () {
      this.unregisterAuthObserver = auth.onAuthStateChanged(authUser => {
        if (this.unregisterTokenObserver) {
          this.unregisterTokenObserver();
        }

        if (authUser) {
          this.unregisterTokenObserver = firestore.collection('userTokens').doc(authUser.uid).onSnapshot(async (tokens) => {
            accountStatus = tokens.data().accountStatus
            if (accountStatus === 'authorized') {
              await authUser.getIdToken(true);
            }
            this.setState(() => ({ authUser, accountStatus }))
          })
          this.setState(() => ({ authUser }));
        } else {
          this.setState(() => ({ authUser: null, accountStatus: null }));
        }
      })
    }

    componentWillUnmount() {
      this.unregisterTokenObserver();
      this.unregisterAuthObserver();
    }

    render () {
      const { authUser, accountStatus } = this.state;

      return (
        <AuthDataContext.Provider value={{ authUser, accountStatus }}>
          <Component {...this.props} />
        </AuthDataContext.Provider>
      )
    }
  }

  return WithAuthentication
}

export default withAuthentication
