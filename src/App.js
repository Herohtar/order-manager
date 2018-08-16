import React from 'react'
import { Router } from 'react-static'
import Routes from 'react-static-routes'
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

class App extends React.PureComponent {
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render() {
    const { classes } = this.props

    return (
      <Router>
        <div>
          <CssBaseline />
          <AppBar position="sticky" className={classes.appBar}>
            <Navigation />
          </AppBar>
          <main>
            <Routes />
          </main>
        </div>
      </Router>
    )
  }
}

const enhance = compose(
  withAuthentication,
  withStyles(styles),
)

export default enhance(App)
