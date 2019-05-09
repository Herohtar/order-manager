import React from 'react'
import { Root, Routes } from 'react-static'
import { compose } from 'recompose'
//
import withAuthentication from './session/withAuthentication'
import { withStyles } from '@material-ui/core/styles'
import Navigation from './components/Navigation'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
})

const App = ({ classes }) => (
  <Root>
    <div>
      <CssBaseline />
      <AppBar position="sticky" className={classes.appBar}>
        <Navigation />
      </AppBar>
      <main>
        <Routes />
      </main>
    </div>
  </Root>
)

const enhance = compose(
  withAuthentication,
  withStyles(styles),
)

export default enhance(App)
