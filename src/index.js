import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from '@material-ui/styles'

// Your top level component
import App from './App'

import theme from './theme'

// Export your top level component as JSX (for static rendering)
export default App

// Render your app
if (typeof document !== 'undefined') {
  const target = document.querySelector('#root')
  const renderMethod = target.hasChildNodes() ? ReactDOM.hydrate : ReactDOM.render
  const render = Comp => {
    renderMethod(
      <ThemeProvider theme={theme}>
        <Comp />
      </ThemeProvider>,
      target,
      () => {
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles && jssStyles.parentNode) {
          jssStyles.parentNode.removeChild(jssStyles)
        }
      }
    )
  }

  // Render!
  render(App)

  if (module && module.hot) {
    module.hot.accept('./App', () => render(App))
  }
}
