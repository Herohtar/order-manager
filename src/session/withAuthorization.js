import React, { useEffect, useContext } from 'react'
//
import { navigate } from '../components/Router'
import AuthDataContext from './AuthDataContext'
import { auth } from '../firebase'

export default condition => Component => props => {
  const authData = useContext(AuthDataContext)

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(async (authUser) => {
      if (!(await condition(authUser))) {
        navigate('/', { replace: true })
      }
    })

    return () => unregisterAuthObserver()
  }, [])

  return authData.authUser ? <Component authData={authData} {...props} /> : null
}
