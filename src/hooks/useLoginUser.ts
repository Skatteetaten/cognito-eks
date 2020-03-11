import { AwsCognitoConfiguration, CredentialsOptions } from '../types';
import { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import Amplify, { Auth, Hub } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';

/**
 * 1. Fetch configuration from server.
 */
function useAwsCognitoConfiguration(): AwsCognitoConfiguration | undefined {
  const [config, setConfig] = useState<AwsCognitoConfiguration | undefined>();
  useEffect(() => {
    const fetchConfig = async () => {
      const res = await fetch('/api/config', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const body: AwsCognitoConfiguration | undefined = await res.json();
      setConfig(body);
    };

    fetchConfig();
  }, []);

  return config;
}

/**
 * 2 Configure Amplify with configuration fetched in step 1.
 * @param config
 */
function useAmplifyConfigure(config?: AwsCognitoConfiguration): boolean {
  const [isConfigured, setIsConfigured] = useState(false);
  useEffect(() => {
    if (!config) {
      return;
    }
    Amplify.configure({
      Auth: {
        region: config.REGION,
        userPoolWebClientId: config.USER_POOL_WEBCLIENT_ID,
        userPoolId: config.USER_POOL_ID,
        oauth: {
          domain: config.OAUTH_DOMAIN,
          scope: config.OAUTH_SCOPE,
          redirectSignIn: config.OAUTH_REDIRECT_SIGN_IN,
          redirectSignOut: config.OAUTH_REDIRECT_SIGN_OUT,
          responseType: config.OAUTH_RESPONSE_TYPE
        }
      }
    });
    setIsConfigured(true);
  }, [config]);

  return isConfigured;
}

/**
 * 3. Wait for user to login.
 */
function useCognitoUser(isConfigured: boolean): CognitoUser | undefined {
  const [user, setUser] = useState<CognitoUser | undefined>();

  useEffect(() => {
    if (!isConfigured) {
      return;
    }

    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          setUser(data);
          break;
        case 'signOut':
          setUser(data);
          break;
      }
    });

    Auth.currentAuthenticatedUser()
      .then(user => setUser(user))
      .catch(() => console.log('Not signed in'));
  }, [isConfigured]);

  return user;
}

const loadCredentials = (cognito: AWS.CognitoIdentityCredentials) =>
  new Promise((resolve, reject) => {
    cognito.get(err => (err ? reject(err) : resolve()));
  });

/**
 * 4. Get credentials for logged in user.
 * @param user
 * @param config
 */
function useAwsCredentials(
  user?: CognitoUser,
  config?: AwsCognitoConfiguration
): CredentialsOptions | undefined {
  const [credentials, setCredentials] = useState<
    CredentialsOptions | undefined
  >();
  useEffect(() => {
    if (!config || !user) {
      return;
    }
    const cognito = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: config.IDENTITY_POOL_ID,
      Logins: {
        [`cognito-idp.${config.REGION}.amazonaws.com/${config.USER_POOL_ID}`]:
          user
            ?.getSignInUserSession()
            ?.getIdToken()
            .getJwtToken() ?? ''
      }
    });

    AWS.config.region = config.REGION;
    AWS.config.credentials = cognito;
    AWS.config.cognitoidentity = cognito;

    const load = async () => {
      await loadCredentials(cognito);
      if (AWS.config.credentials) {
        setCredentials({
          accessKeyId: AWS.config.credentials.accessKeyId,
          secretAccessKey: AWS.config.credentials.secretAccessKey,
          sessionToken: AWS.config.credentials.sessionToken
        });
      }
    };
    load();
  }, [config, user]);

  return credentials;
}

/**
 * Use once in application.
 */
export function useLoginUser(): [CognitoUser?, CredentialsOptions?] {
  const configuration = useAwsCognitoConfiguration();
  const isConfigured = useAmplifyConfigure(configuration);
  const user = useCognitoUser(isConfigured);
  const credentials = useAwsCredentials(user, configuration);

  return [user, credentials];
}
