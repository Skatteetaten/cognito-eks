import React, { FC } from 'react';
import { Auth } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';

interface LoginProps {
  user?: CognitoUser;
}

export const Login: FC<LoginProps> = ({ user }) => {
  return (
    <div className="App">
      <button onClick={() => Auth.federatedSignIn()}>Open Hosted UI</button>
      <button onClick={() => Auth.signOut()}>
        Sign Out {user?.getUsername()}
      </button>
    </div>
  );
};
