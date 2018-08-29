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
    signInSuccessWithAuthResult: (authResult) => {
      if (authResult.additionalUserInfo.isNewUser) {

      }
    }
  },
  credentialHelper: 'none'
}

const AccountMessage = ({ authData }) => {
  const { accountStatus, token } = authData
  switch (accountStatus) {
    case null:
      return null
    case 'pending':
      return <Typography variant="body1">Please wait while your account is being set up.</Typography>
    case 'ready':
      return token.claims.hasAccess ?
        <Typography variant="body1">To view orders please visit your <Link to="/dashboard">dashboard</Link>.</Typography>
        :
        <Typography variant="body1">It seems your account does not belong to an authorized user. If this is incorrect, please contact the site admin.</Typography>
    default:
      return <Typography variant="body1">An unknown error has occurred. If you keep seeing this message, please contact the site admin.</Typography>
  }
}

export default withStyles(styles)(({ classes }) => (
  <AuthDataContext.Consumer>
    {
      authData => authData.authUser ?
      <div className={classes.root}>
        <SiteData render={({title}) => (
            <Head title={title} />
        )} />
        { authData.accountStatus ?
          <Typography variant="display1" paragraph>Welcome!</Typography>
          :
          <Typography variant="display1" paragraph>Processing login...</Typography>
        }
        <AccountMessage authData={authData} />
      </div>
      :
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    }
  </AuthDataContext.Consumer>
))
