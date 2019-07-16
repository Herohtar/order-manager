import React, { useState, useEffect } from 'react'
import { Head, useSiteData } from 'react-static'
//
import { auth, firestore } from '../firebase'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import ErrorTwoToneIcon from '@material-ui/icons/ErrorTwoTone'
import YesNoDialog from '../components/YesNoDialog'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import withAuthorization from '../session/withAuthorization'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
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
}))

const authCondition = authUser => !!authUser

export default withAuthorization(authCondition)(({ authData }) => {
  const classes = useStyles()
  const { title } = useSiteData()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [getEmails, setGetEmails] = useState(false)

  useEffect(() => {
    const unsubscribeUserChanged = firestore.collection('users').doc(authData.authUser.uid).onSnapshot(doc => {
      setGetEmails(doc.get('getEmails'))
    })

    return () => unsubscribeUserChanged()
  }, [])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setError(false)
  }

  const handleDeleteClick = () => {
    setDialogOpen(true)
  }

  const handleNo = () => {
    setDialogOpen(false)
  }

  const handleYes = () => {
    auth.currentUser.delete().catch(error => {
      setError(true)
      setErrorMessage(error.message)
    })
    setDialogOpen(false)
  }

  const handleGetEmailsChange = async (event) => {
    await firestore.collection('users').doc(authData.authUser.uid).update({ getEmails: event.target.checked })
  }


  return (
    <Grid container justify="center" className={classes.root}>
      <Head title={`Account - ${title}`} />
      <Grid item xs={4}>
        <Card className={classes.card}>
          <CardMedia image={authData.authUser.photoURL} className={classes.media} />
          <CardContent className={classes.content}>
            {(authData.accountStatus === 'pending') && <Typography variant="headline" paragraph>Account setup pending.</Typography>}
            <Typography variant="h5">{authData.authUser.displayName}</Typography>
            <Typography variant="subtitle1" paragraph>{authData.authUser.email}</Typography>
            {(!!authData.token && (authData.token.claims.hasAccess || authData.token.claims.admin)) ?
              <FormControlLabel control={<Checkbox checked={getEmails} onChange={handleGetEmailsChange} value="getEmails" />} label="Get order notification emails" />
              :
              null
            }
          </CardContent>
          <CardActions className={classes.actions}>
            <Button variant="contained" color="primary" onClick={() => auth.signOut()}>Sign Out</Button>
            <Button variant="outlined" onClick={handleDeleteClick}>Delete Account</Button>
          </CardActions>
        </Card>
      </Grid>
      <YesNoDialog open={dialogOpen} title="Delete account?" message="Are you sure you want to delete your account? You will be signed out and will no longer have accesss to your order dashboard." noText="No" yesText="Yes, delete my account" onNo={handleNo} onYes={handleYes} />
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={error} onClose={handleClose} autoHideDuration={5000} message={errorMessage} action={<ErrorTwoToneIcon color="error" />} />
    </Grid>
  )
})
