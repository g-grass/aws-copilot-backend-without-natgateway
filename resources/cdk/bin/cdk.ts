#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CognitoStack } from '../lib/cognito-stack';
import { VPCStack } from '../lib/vpc-stack';

const app = new cdk.App();
new VPCStack(app, 'VPCStack');
new CognitoStack(app, 'CognitoStack');