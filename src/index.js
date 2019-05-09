import React from 'react'
import ReactDOM from 'react-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

// Your top level component
import App from './App'

import theme from './theme'

// Export your top level component as JSX (for static rendering)
export default App

// Render your app
if (typeof document !== 'undefined') {
  const target = document.getElementById('root')
  const renderMethod = target.hasChildNodes() ? ReactDOM.hydrate : ReactDOM.render
  const muiTheme = createMuiTheme(theme)
  const render = Comp => {
    renderMethod(
      <MuiThemeProvider theme={muiTheme}>
        <Comp />
      </MuiThemeProvider>,
      target,
      () => {
        const jssStyles = document.getElementById('jss-server-side')
        if (jssStyles && jssStyles.parentNode) {
          jssStyles.parentNode.removeChild(jssStyles)
        }
      }
    )
  }

  // Render!
  render(App)

  // Hot Module Replacement
  if (module && module.hot) {
    module.hot.accept('./App', () => render(App))
  }
}
