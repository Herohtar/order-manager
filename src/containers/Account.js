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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { compose } from 'recompose'

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
  }

  handleDeleteClick = () => {
    this.setState(() => ({ dialogOpen: true }))
  }

  handleNo = () => {
    this.setState(() => ({ dialogOpen: false }))
  }

  handleYes = () => {
    this.deleteAccount(this.props.authUser)
    this.setState(() => ({dialogOpen: false }))
  }

  deleteAccount = async (authUser) => {
    await firestore.collection('users').doc(authUser.uid).delete()
    await auth.currentUser.delete()
  }

  render() {
    const { authUser, classes } = this.props
    const { dialogOpen } = this.state

    return (
      <Grid container justify="center" className={classes.root}>
        <SiteData render={({title}) => (
          <Head title={`Account - ${title}`} />
        )} />
        <Grid item xs={4}>
          <Card>
            <CardMedia image={authUser.photoURL} className={classes.media} />
            <CardContent>
              <Typography variant="headline">Name: {authUser.displayName}</Typography>
              <Typography variant="headline">Email: {authUser.email}</Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" onClick={() => auth.signOut()}>Sign Out</Button>
              <Button variant="outlined" onClick={this.handleDeleteClick}>Delete Account</Button>
            </CardActions>
            <Dialog open={dialogOpen}>
              <DialogTitle>Delete account?</DialogTitle>
              <DialogContent>
                <DialogContentText>Are you sure you want to delete your account? You will no longer be able to view your order dashboard.</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleNo} autoFocus>No</Button>
                <Button onClick={this.handleYes}>Yes, delete my account</Button>
              </DialogActions>
            </Dialog>
          </Card>
        </Grid>
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
