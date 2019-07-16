import React, { useContext } from 'react'
import { Head, useSiteData } from 'react-static'
//
import AuthDataContext from '../session/AuthDataContext'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { auth, firebase } from '../firebase'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
}))

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  },
  credentialHelper: 'none',
}

const AccountMessage = ({ authData }) => {
  const { accountStatus, token } = authData
  let title;
  let message;
  switch (accountStatus) {
    case null:
      title = 'Processing login...'
      message = 'Please wait while your account is being set up.'
      break
    case 'pending':
      title = 'Welcome!'
      message = 'We\'re still setting up a few things on your account. If you keep seeing this message, please contact the site admin.'
      break
    case 'ready':
      if (!!token && token.claims.hasAccess) {
        title = 'Welcome!'
        message = 'To view orders please visit the dashboard.'
      } else {
        title = 'Unauthorized'
        message = 'It seems your account does not belong to an authorized user. If this is incorrect, please contact the site admin.'
      }
      break
    default:
     title = 'Error'
     message = 'An unknown error has occurred. If you keep seeing this message, please contact the site admin.'
     break
  }
  return (
    <>
      <Typography variant="h4" paragraph>{title}</Typography>
      <Typography variant="body2">{message}</Typography>
    </>
  )
}

export default props => {
  const classes = useStyles()
  const { title } = useSiteData()
  const authData = useContext(AuthDataContext)

  return (
    <div className={classes.root}>
        <Head title={title} />
      {authData.authUser ?
        <AccountMessage authData={authData} />
        :
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      }
    </div>
  )
}
