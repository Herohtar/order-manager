import React from 'react'
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles'

import theme from './src/theme'

export default () => ({
  beforeRenderToHtml: (App, { meta }) => {
    meta.muiSheets = new ServerStyleSheets()

    return meta.muiSheets.collect(
      <ThemeProvider theme={theme}>
        {App}
      </ThemeProvider>
    )
  },
  headElements: (elements, { meta }) => [
    ...elements,
    meta.muiSheets.getStyleElement(),
  ],
})
