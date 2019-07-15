import React from 'react'
//
import withAuthorization from '../session/withAuthorization'

const authCondition = async authUser => {
  if (!authUser) {
    return false;
  }

  const token = await authUser.getIdTokenResult();
  return token.claims.admin === true;
}

export default withAuthorization(authCondition)(() => <div>Admin Page</div>)
