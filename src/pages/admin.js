import React from 'react'
//
import withAuthorization from '../session/withAuthorization'

const Admin = () => <div>Admin Page</div>

const authCondition = async authUser => {
  if (!authUser) {
    return false;
  }

  const token = await authUser.getIdTokenResult();
  return token.claims.admin === true;
}

export default withAuthorization(authCondition)(Admin)