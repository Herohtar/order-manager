import React from 'react'

import AuthUserContext from './AuthUserContext';
import { auth, firestore } from '../firebase'

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor (props) {
      super(props)

      this.state = {
        authUser: null,
      }
    }

    componentDidMount () {
      this.unregisterAuthObserver = auth.onAuthStateChanged(authUser => {
        if (this.unregisterTokenObserver) {
          this.unregisterTokenObserver();
        }

        if (authUser) {
          this.unregisterTokenObserver = firestore.collection('refreshTokens').doc(authUser.uid).onSnapshot(() => {
            authUser.getIdToken(true);
          })
          this.setState(() => ({ authUser }));
        } else {
          this.setState(() => ({ authUser: null }));
        }
      })
    }

    componentWillUnmount() {
      this.unregisterTokenObserver();
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
