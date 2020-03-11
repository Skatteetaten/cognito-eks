export interface AwsCognitoConfiguration {
  REGION: string;
  IDENTITY_POOL_ID: string;
  USER_POOL_WEBCLIENT_ID: string;
  USER_POOL_ID: string;
  OAUTH_DOMAIN: string;
  OAUTH_SCOPE: string[];
  OAUTH_REDIRECT_SIGN_IN: string;
  OAUTH_REDIRECT_SIGN_OUT: string;
  OAUTH_RESPONSE_TYPE: string;
}

// Copied from AWS
export interface CredentialsOptions {
  /**
   * AWS access key ID.
   */
  accessKeyId: string;
  /**
   * AWS secret access key.
   */
  secretAccessKey: string;
  /**
   * AWS session token.
   */
  sessionToken?: string;
}
