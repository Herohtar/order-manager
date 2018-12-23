import React from 'react'
import JssProvider from 'react-jss/lib/JssProvider'
import { MuiThemeProvider, createMuiTheme, createGenerateClassName } from '@material-ui/core/styles'
import { SheetsRegistry } from 'react-jss/lib/jss'

import theme from './src/theme'

export default () => ({
  beforeRenderToElement: (App, { meta }) => props => {
    meta.sheetsRegistry = new SheetsRegistry()

    const muiTheme = createMuiTheme(theme)
    const generateClassName = createGenerateClassName()
    const sheetsManager = new Map()

    return (
      <JssProvider registry={meta.sheetsRegistry} generateClassName={generateClassName}>
        <MuiThemeProvider theme={muiTheme} sheetsManager={sheetsManager}>
          <App {...props} />
        </MuiThemeProvider>
      </JssProvider>
    )
  },
  Head: ({ meta }) => (
    <React.Fragment>
      <style id="jss-server-side" dangerouslySetInnerHTML={{ __html: meta.sheetsRegistry.toString() }} />
    </React.Fragment>
  ),
})
