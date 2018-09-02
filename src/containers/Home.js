import React from 'react'
import { SiteData, Head, Link } from 'react-static'
//
import AuthDataContext from '../session/AuthDataContext'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { auth, firebase, firestore } from '../firebase'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
  },
})

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
    <React.Fragment>
      <Typography variant="display1" paragraph>{title}</Typography>
      <Typography variant="body1">{message}</Typography>
    </React.Fragment>
  )
}

export default withStyles(styles)(({ classes }) => (
  <AuthDataContext.Consumer>
    {
      authData => (
        <div className={classes.root}>
          <SiteData render={({title}) => (
              <Head title={title} />
          )} />
          {authData.authUser ?
            <AccountMessage authData={authData} />
            :
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
          }
        </div>
      )
    }
  </AuthDataContext.Consumer>
))
