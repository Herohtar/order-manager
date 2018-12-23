export const Home = {
  path: '/',
  label: 'Home',
  condition: () => true,
}
export const Dashboard = {
  path: '/dashboard',
  label: 'Dashboard',
  condition: authData => !!authData.token && (authData.token.claims.hasAccess === true),
}
export const Admin = {
  path: '/admin',
  label: 'Admin',
  condition: authData => !!authData.token && (authData.token.claims.admin === true),
}
export const Account = {
  path: '/account',
  label: 'Account',
  condition: authData => !!authData.authUser,
}
