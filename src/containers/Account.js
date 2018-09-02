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
import ErrorTwoToneIcon from '@material-ui/icons/ErrorTwoTone'
import { compose } from 'recompose'
import YesNoDialog from '../components/YesNoDialog'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import withAuthorization from '../session/withAuthorization'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
  },
  card: {
    display: 'flex',
    alignItems: 'stretch',
    minHeight: 150,
  },
  media: {
    width: 150,
  },
  content: {
    flexGrow: 1,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
  },
})

class Account extends React.Component {
  state = {
    dialogOpen: false,
    error: false,
    errorMessage: null,
    getEmails: false,
  }

  componentDidMount() {
    const { authData } = this.props
    this.unsubscribeUserChanged = firestore.collection('users').doc(authData.authUser.uid).onSnapshot(doc => {
      const getEmails = doc.get('getEmails')
      this.setState(() => ({ getEmails }))
    })
  }

  componentWillUnmount() {
    this.unsubscribeUserChanged()
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

  handleGetEmailsChange = async (event) => {
    const { authData } = this.props
    await firestore.collection('users').doc(authData.authUser.uid).update({ getEmails: event.target.checked })
  }

  render() {
    const { authData, classes } = this.props
    const { dialogOpen, error, errorMessage, getEmails } = this.state

    return (
      <Grid container justify="center" className={classes.root}>
        <SiteData render={({title}) => (
          <Head title={`Account - ${title}`} />
        )} />
        <Grid item xs={4}>
          <Card className={classes.card}>
            <CardMedia image={authData.authUser.photoURL} className={classes.media} />
            <CardContent className={classes.content}>
              {(authData.accountStatus === 'pending') && <Typography variant="headline" paragraph>Account setup pending.</Typography>}
              <Typography variant="headline">{authData.authUser.displayName}</Typography>
              <Typography variant="subheading" paragraph>{authData.authUser.email}</Typography>
              {(!!authData.token && (authData.token.claims.hasAccess || authData.token.claims.admin)) ?
                <FormControlLabel control={<Checkbox checked={getEmails} onChange={this.handleGetEmailsChange} value="getEmails" />} label="Get order notification emails" />
                :
                null
              }
            </CardContent>
            <CardActions className={classes.actions}>
              <Button variant="contained" color="primary" onClick={() => auth.signOut()}>Sign Out</Button>
              <Button variant="outlined" onClick={this.handleDeleteClick}>Delete Account</Button>
            </CardActions>
          </Card>
        </Grid>
        <YesNoDialog open={dialogOpen} title="Delete account?" message="Are you sure you want to delete your account? You will be signed out and will no longer have accesss to your order dashboard." noText="No" yesText="Yes, delete my account" onNo={this.handleNo} onYes={this.handleYes} />
        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={error} onClose={this.handleClose} autoHideDuration={5000} message={errorMessage} action={<ErrorTwoToneIcon color="error" />} />
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
