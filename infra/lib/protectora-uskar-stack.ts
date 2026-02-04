import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayv2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';

export class ProtectoraUskarStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stage = 'prod';

    // -------------------------------------------------------
    // 1. S3 Bucket - Uploads (fotos/videos de mascotas)
    //    Bucket ya existente creado por Serverless Framework
    // -------------------------------------------------------
    const uploadsBucketName = `protectora-uskar-uploads-${stage}`;
    const uploadsBucket = s3.Bucket.fromBucketName(this, 'UploadsBucket', uploadsBucketName);

    // -------------------------------------------------------
    // 2. Lambda Function - Backend API
    // -------------------------------------------------------
    const backendLambda = new lambda.Function(this, 'BackendLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'lambda.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../backend'), {
        exclude: [
          'node_modules/.cache',
          '.serverless',
          'uploads',
          '.env',
        ],
      }),
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      environment: {
        MONGODB_URI: process.env.MONGODB_URI ?? '',
        S3_BUCKET_NAME: uploadsBucket.bucketName,
        NODE_ENV: 'production',
      },
    });

    // Permisos de Lambda sobre el bucket de uploads
    uploadsBucket.grantReadWrite(backendLambda);

    // -------------------------------------------------------
    // 3. API Gateway (HTTP API)
    // -------------------------------------------------------
    const httpApi = new apigatewayv2.HttpApi(this, 'BackendApi', {
      apiName: 'protectora-uskar-api',
      corsPreflight: {
        allowHeaders: ['Content-Type', 'Authorization', 'X-Amz-Date', 'X-Api-Key'],
        allowMethods: [
          apigatewayv2.CorsHttpMethod.GET,
          apigatewayv2.CorsHttpMethod.POST,
          apigatewayv2.CorsHttpMethod.PUT,
          apigatewayv2.CorsHttpMethod.DELETE,
          apigatewayv2.CorsHttpMethod.OPTIONS,
        ],
        allowOrigins: ['*'],
        maxAge: cdk.Duration.hours(1),
      },
    });

    // Ruta proxy: todas las peticiones van a Lambda
    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [apigatewayv2.HttpMethod.ANY],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration(
        'LambdaIntegration',
        backendLambda
      ),
    });

    // -------------------------------------------------------
    // 4. S3 Bucket - Frontend (hosting estatico via CloudFront)
    // -------------------------------------------------------
    const frontendBucket = new s3.Bucket(this, 'FrontendBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // -------------------------------------------------------
    // 5. CloudFront Distribution
    // -------------------------------------------------------
    const oac = new cloudfront.S3OriginAccessControl(this, 'FrontendOAC', {
      signing: cloudfront.Signing.SIGV4_NO_OVERRIDE,
    });

    const distribution = new cloudfront.Distribution(this, 'FrontendDistribution', {
      defaultBehavior: {
        origin: cloudfrontOrigins.S3BucketOrigin.withOriginAccessControl(frontendBucket, {
          originAccessControl: oac,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    });

    // -------------------------------------------------------
    // 6. S3 Deployment - Frontend + config.js dinamico
    // -------------------------------------------------------
    const apiUrl = httpApi.apiEndpoint;

    // Deploy del frontend al bucket S3
    new s3deploy.BucketDeployment(this, 'DeployFrontend', {
      sources: [
        // Codigo fuente del frontend
        s3deploy.Source.asset(path.join(__dirname, '../../frontend')),
        // config.js generado dinamicamente con la URL del API Gateway
        s3deploy.Source.data(
          'js/config.js',
          `// Configuracion generada automaticamente por CDK - NO EDITAR\n` +
          `const CONFIG = {\n` +
          `    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'\n` +
          `        ? 'http://localhost:3000'\n` +
          `        : '${apiUrl}'\n` +
          `};\n\n` +
          `window.API_BASE_URL = CONFIG.API_BASE_URL;\n`
        ),
      ],
      destinationBucket: frontendBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // -------------------------------------------------------
    // Outputs
    // -------------------------------------------------------
    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'URL del frontend (CloudFront)',
    });

    new cdk.CfnOutput(this, 'ApiGatewayURL', {
      value: apiUrl,
      description: 'URL del API Gateway (backend)',
    });

    new cdk.CfnOutput(this, 'UploadsBucketName', {
      value: uploadsBucket.bucketName,
      description: 'Nombre del bucket de uploads',
    });
  }
}
