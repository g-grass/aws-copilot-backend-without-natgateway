import { Stack, StackProps } from 'aws-cdk-lib';
import { GatewayVpcEndpointAwsService, InterfaceVpcEndpointAwsService, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class VPCStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'Vpc', {
      cidr: '10.0.0.0/16',
      subnetConfiguration: [
        {
          cidrMask: 24,
          // NATGateway無しでプライベートサブネットを構築するタイプ
          subnetType: SubnetType.PRIVATE_ISOLATED,
          name: 'private-1',
        }
      ]
    })

    vpc.addInterfaceEndpoint('CloudWatchLogsEndpoit', {
      service:InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS
    })

    vpc.addInterfaceEndpoint('EcrDkrEndpoint', {
      service:InterfaceVpcEndpointAwsService.ECR_DOCKER
    })

    vpc.addInterfaceEndpoint('EcrApiEndpoint', {
      service: InterfaceVpcEndpointAwsService.ECR
    })

    vpc.addGatewayEndpoint('S3Endpoint', {
      service: GatewayVpcEndpointAwsService.S3
    })

    vpc.addGatewayEndpoint('DynamoDBEndpoint', {
      service: GatewayVpcEndpointAwsService.DYNAMODB
    })
  }
}
