# Get EKS token with Cognito

## Requirements

- `kubectl` with an available cluster context.
- AWS Cognito with a user pool and federated identities.
- An app client for that user pool.
  - Add an "Amazon Cognito domain" for hosted UI sign in.
- Identity pool must be configured with Cognito as "Authentication providers".
  - "Authenticated role selection" -> "Choose role from token"
  - "Role resoulution" -> "DENY"
- User pool contains a group with a user. The role for that group is added to ConfigMap `aws-auth` in `kube-system` in EKS.

  - Make sure that this role can list namespaces in Kubernetes. Example:

  ```
    mapRoles: |
    - rolearn: arn:aws:iam::<accountid>:role/<role name>
      username: arn:aws:iam::<accountid>:role/<role name>
      groups:
      - system:masters
  ```

## Configuration

Add `.env` file to your project with the following configuration (add your values):

```
EKS_REGION=
EKS_NAME=

COGNITO_REGION=
IDENTITY_POOL_ID=
USER_POOL_WEBCLIENT_ID=
USER_POOL_ID=
OAUTH_DOMAIN=
OAUTH_SCOPE="email, profile, openid, aws.cognito.signin.user.admin"
OAUTH_REDIRECT_SIGN_IN="http://localhost:3000/"
OAUTH_REDIRECT_SIGN_OUT="http://localhost:3000/"
OAUTH_RESPONSE_TYPE="code"
```

## How does it work?

`src/hooks/useAuthenticatedUser.ts` contains the logic for authenticate a user with
Cognito. It returns the current user and its credentials. The credentials will be sent from
`src/index.ts` to `api/routes/eksRoute.ts` which will generate an EKS token and execute
`kubectl get namespaces --token=<generated token>` and return a list with namespaces.
