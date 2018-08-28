import React from 'react'
import { SiteData, Head } from 'react-static'
import { auth, firestore } from '../firebase'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import Icon from '@material-ui/core/Icon'
import { compose } from 'recompose'
import YesNoDialog from '../components/YesNoDialog'

import withAuthorization from '../session/withAuthorization'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
  },
  media: {
    height: 300,
  },
})

class Account extends React.Component {
  state = {
    dialogOpen: false,
    error: false,
    errorMessage: null,
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    this.setState({ error: false })
  }

  handleDeleteClick = () => {
    this.setState(() => ({ dialogOpen: true }))
  }

  handleNo = () => {
    this.setState(() => ({ dialogOpen: false }))
  }

  handleYes = () => {
    auth.currentUser.delete().catch(error =>
      this.setState(() => ({ error: true, errorMessage: error.message }))
    )
    this.setState(() => ({dialogOpen: false }))
  }

  render() {
    const { authData, classes } = this.props
    const { dialogOpen, error, errorMessage } = this.state

    return (
      <Grid container justify="center" className={classes.root}>
        <SiteData render={({title}) => (
          <Head title={`Account - ${title}`} />
        )} />
        <Grid item xs={4}>
          <Card>
            <CardMedia image={authData.authUser.photoURL} className={classes.media} />
            <CardContent>
              {(authData.accountStatus === 'pending') && <Typography variant="headline" paragraph>Account setup pending.</Typography>}
              <Typography variant="headline">Name: {authData.authUser.displayName}</Typography>
              <Typography variant="headline">Email: {authData.authUser.email}</Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" onClick={() => auth.signOut()}>Sign Out</Button>
              <Button variant="outlined" onClick={this.handleDeleteClick}>Delete Account</Button>
            </CardActions>
            <YesNoDialog open={dialogOpen} title="Delete account?" message="Are you sure you want to delete your account? You will be signed out and will no longer have accesss to your order dashboard." noText="No" yesText="Yes, delete my account" onNo={this.handleNo} onYes={this.handleYes} />
          </Card>
        </Grid>
        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={error} onClose={this.handleClose} autoHideDuration={5000} message={errorMessage} action={<Icon color="error">error_outline</Icon>} />
      </Grid>
    )
  }
}

const authCondition = authUser => !!authUser

const enhance = compose(
  withAuthorization(authCondition),
  withStyles(styles),
)

export default enhance(Account)
