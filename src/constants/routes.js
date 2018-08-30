export const Home = {
  path: '/',
  exact: true,
  label: 'Home',
  component: 'src/containers/Home',
  condition: () => true,
}
export const Dashboard = {
  path: '/dashboard',
  exact: false,
  label: 'Dashboard',
  component: 'src/containers/Dashboard',
  condition: authData => !!authData.token && (authData.token.claims.hasAccess === true),
}
export const Admin = {
  path: '/admin',
  exact: false,
  label: 'Admin',
  component: 'src/containers/Admin',
  condition: authData => !!authData.token && (authData.token.claims.admin === true),
}
export const Account = {
  path: '/account',
  exact: false,
  label: 'Account',
  component: 'src/containers/Account',
  condition: authData => !!authData.authUser,
}