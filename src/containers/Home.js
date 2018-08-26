import React from 'react'
import { SiteData, Head, Link } from 'react-static'
//
import AuthUserContext from '../session/AuthUserContext'
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

export default withStyles(styles)(({ classes }) => (
  <AuthUserContext.Consumer>
    {
      authUser => authUser ?
      <div className={classes.root}>
        <SiteData render={({title}) => (
            <Head title={title} />
        )} />
        <Typography variant="display1" paragraph>Welcome!</Typography>
        <Typography variant="body1">To view orders please visit your <Link to="/dashboard">dashboard</Link>.</Typography>
      </div>
      :
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    }
  </AuthUserContext.Consumer>
))
