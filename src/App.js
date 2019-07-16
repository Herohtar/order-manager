import React, { useState, useEffect } from 'react'
import { Root, Routes } from 'react-static'
//
import { makeStyles } from '@material-ui/styles'
import AuthDataContext from './session/AuthDataContext';
import { auth, firestore } from './firebase'
import Navigation from './components/Navigation'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}))

export default () => {
  const classes = useStyles()
  const [authUser, setAuthUser] = useState(null)
  const [accountStatus, setAccountStatus] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    let unregisterTokenObserver
    const unregisterAuthObserver = auth.onAuthStateChanged(async (authUser) => {
      if (unregisterTokenObserver) {
        unregisterTokenObserver()
        unregisterTokenObserver = null
      }

      if (authUser) {
        unregisterTokenObserver = firestore.collection('userTokens').doc(authUser.uid).onSnapshot(async (tokens) => {
          const accountStatus = tokens.get('accountStatus') || null
          const forceRefresh = (accountStatus === 'ready')
          const token = await authUser.getIdTokenResult(forceRefresh)
          setAuthUser(authUser)
          setAccountStatus(accountStatus)
          setToken(token)
        })
      } else {
        setAuthUser(null)
        setAccountStatus(null)
        setToken(null)
      }
    })

    return () => {
      if (unregisterAuthObserver) {
        unregisterAuthObserver()
      }

      if (unregisterTokenObserver) {
        unregisterTokenObserver()
      }
    }
  }, [])

  return (
    <Root>
      <AuthDataContext.Provider value={{ authUser, accountStatus, token }}>
        <div>
          <CssBaseline />
          <AppBar position="sticky" className={classes.appBar}>
            <Navigation />
          </AppBar>
          <main>
            <React.Suspense fallback={'Loading...'}>
              <Routes />
            </React.Suspense>
          </main>
        </div>
      </AuthDataContext.Provider>
    </Root>
  )
}
