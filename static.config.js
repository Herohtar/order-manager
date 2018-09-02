import React from 'react'
import { SheetsRegistry } from 'react-jss/lib/jss'
import JssProvider from 'react-jss/lib/JssProvider'
import { MuiThemeProvider, createMuiTheme, createGenerateClassName } from '@material-ui/core/styles'

import * as routes from './src/constants/routes'
import theme from './src/theme'

import siteConfig from './src/content/SiteConfig.json'

export default {
  siteRoot: siteConfig.url,
  getSiteData: () => siteConfig,
  getRoutes: async () => {
    return [
      {
        path: routes.Home.path,
        component: routes.Home.component,
      },
      {
        path: routes.Dashboard.path,
        component: routes.Dashboard.component,
      },
      {
        path: routes.Admin.path,
        component: routes.Admin.component,
      },
      {
        path: routes.Account.path,
        component: routes.Account.component,
      },
      {
        is404: true,
        component: 'src/containers/404',
      },
    ]
  },
  renderToHtml: (render, Comp, meta) => {
    const sheetsRegistry = new SheetsRegistry()
    const muiTheme = createMuiTheme(theme)
    const generateClassName = createGenerateClassName()
    const html = render(
      <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
        <MuiThemeProvider theme={muiTheme} sheetsManager={new Map()}>
          <Comp />
        </MuiThemeProvider>
      </JssProvider>
    )

    meta.jssStyles = sheetsRegistry.toString()

    return html
  },
  Document: class CustomHtml extends React.Component {
    render() {
      const {
        Html, Head, Body, children, renderMeta,
      } = this.props

      return (
        <Html>
          <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet" />
            <script src="https://identity-js.netlify.com/v1/netlify-identity-widget.js" />
          </Head>
          <Body>
            {children}
            <style id="jss-server-side">{renderMeta.jssStyles}</style>
          </Body>
        </Html>
      )
    }
  },
}
