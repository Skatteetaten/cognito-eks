import { Router } from 'express';
import { SignatureV4 } from '@aws-sdk/signature-v4-node';
import AWS from 'aws-sdk';
import { HttpRequest } from '@aws-sdk/types';
import { URLSearchParams } from 'url';
import { execSync } from 'child_process';
import { EKS_NAME } from '../config';
import { logger } from '../logger';

const eksRouter = Router();

async function generateToken(
  eksId: string,
  credentials: AWS.Credentials
): Promise<string> {
  const signature = new SignatureV4({
    service: 'sts',
    region: 'us-east-1',
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken
    }
  });

  const request: HttpRequest = {
    headers: {
      'x-k8s-aws-id': eksId
    },
    method: 'GET',
    protocol: 'https',
    hostname: 'sts.amazonaws.com',
    query: {
      Action: 'GetCallerIdentity',
      Version: '2011-06-15'
    },
    path: '/'
  };

  const now = new Date();
  now.setSeconds(now.getSeconds() + 58);

  const signedReq = await signature.presignRequest(request, now);

  const params = new URLSearchParams(signedReq.query as Record<string, string>);
  const stsUrl = new URL(`https://sts.amazonaws.com/?${params.toString()}`);

  return (
    'k8s-aws-v1.' +
    Buffer.from(stsUrl.href)
      .toString('base64')
      .replace(/\//, '_')
      .replace(/=/g, '')
  );
}

eksRouter.post('/api/eks', async (req, res) => {
  const credentials = req.body as AWS.Credentials;

  const token = await generateToken(EKS_NAME ?? '', credentials);
  const cmd = `kubectl get namespaces --token=${token} -o json`;

  try {
    const namespaces = JSON.parse(execSync(cmd).toString()).items.map(
      namespace => namespace.metadata.name
    );
    res.send(namespaces);
  } catch (e) {
    const error = e as Error;
    logger.error(error.message);
    res.status(500).send(error.message);
  }
});

export { eksRouter };
