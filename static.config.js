import React from 'react'
//
import * as routes from './src/constants/routes'

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
  Document: ({ Html, Head, Body, children }) => (
    <Html>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet" />
      </Head>
      <Body>
        {children}
      </Body>
    </Html>
  ),
}
