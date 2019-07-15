import React from 'react'
import { Root, Routes } from 'react-static'
//
import withAuthentication from './session/withAuthentication'
import { makeStyles } from '@material-ui/styles'
import Navigation from './components/Navigation'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}))

export default withAuthentication(() => {
  const classes = useStyles()

  return (
    <Root>
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
    </Root>
  )
})
