import { Fn, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AccountRecovery, CfnIdentityPool, CfnIdentityPoolRoleAttachment, UserPool } from 'aws-cdk-lib/aws-cognito';
import { Effect, FederatedPrincipal, PolicyDocument, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class CognitoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const userPool = new UserPool(this, 'UserPool', {
      selfSignUpEnabled: false,
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        phoneNumber: {
          required: false,
        },
      },
      signInCaseSensitive: false,
      autoVerify: {
        email: true,
      },
      signInAliases: {
        email: true,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
    });
    userPool.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const userPoolClient = userPool.addClient('CognitoClient', {
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: false,
        userSrp: true,
      },
    });
    const identityPool = new CfnIdentityPool(this, 'CognitoIdentityPool', {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName,
        },
      ],
    });
    // 認証ユーザ用
    const apiId = Fn.importValue('export-my-app-dev-api-id');
    const metaInfo = Stack.of(this);
    const authenticatedPolicyDocument = new PolicyDocument({
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['cognito-sync:*', 'cognito-identity:*'],
          resources: ['*'],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['execute-api:Invoke'],
          resources: [`arn:aws:execute-api:${metaInfo.region}:${metaInfo.account}:${apiId}/*/POST/create`],
        }),
      ],
    });
    const authRole = new Role(this, 'AuthRole', {
      assumedBy: new FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: { 'cognito-identity.amazonaws.com:aud': identityPool.ref },
          'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'authenticated' },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
      inlinePolicies: { policy: authenticatedPolicyDocument },
    });

    // 未認証ユーザ用 (定義のみ)
    const unauthenticatedPolicyDocument = new PolicyDocument({
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['cognito-sync:*'],
          resources: ['*'],
        }),
      ],
    });
    const unauthRole = new Role(this, 'UnAuthRole', {
      assumedBy: new FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: { 'cognito-identity.amazonaws.com:aud': identityPool.ref },
          'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'unauthenticated' },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
      inlinePolicies: { policy: unauthenticatedPolicyDocument },
    });
    // IdentityPoolへのロールの紐付け
    const attachment = new CfnIdentityPoolRoleAttachment(this, 'IdentityPoolAttachment', {
      identityPoolId: identityPool.ref,
      roles: {
        authenticated: authRole.roleArn,
        unauthenticated: unauthRole.roleArn,
      },
    });
  }
}
