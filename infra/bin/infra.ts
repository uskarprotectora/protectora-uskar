#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProtectoraUskarStack } from '../lib/protectora-uskar-stack';

const app = new cdk.App();

new ProtectoraUskarStack(app, 'ProtectoraUskarStack', {
  env: {
    region: process.env.CDK_DEFAULT_REGION ?? 'eu-west-1',
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});
