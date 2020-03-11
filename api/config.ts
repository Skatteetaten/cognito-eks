import dotenv from 'dotenv';

dotenv.config();

const { env } = process;

const PORT = Number(env.HTTP_PORT || 9090);

const EKS_REGION = env.EKS_REGION;
const EKS_NAME = env.EKS_NAME;

const COGNITO_CONFIG = {
  COGNITO_REGION: env.COGNITO_REGION,
  IDENTITY_POOL_ID: env.IDENTITY_POOL_ID,
  USER_POOL_WEBCLIENT_ID: env.USER_POOL_WEBCLIENT_ID,
  USER_POOL_ID: env.USER_POOL_ID,
  OAUTH_DOMAIN: env.OAUTH_DOMAIN,
  OAUTH_SCOPE: env.OAUTH_SCOPE?.trim()?.split(','),
  OAUTH_REDIRECT_SIGN_IN: env.OAUTH_REDIRECT_SIGN_IN,
  OAUTH_REDIRECT_SIGN_OUT: env.OAUTH_REDIRECT_SIGN_OUT,
  OAUTH_RESPONSE_TYPE: env.OAUTH_RESPONSE_TYPE
};

export { PORT, EKS_REGION, EKS_NAME, COGNITO_CONFIG };
