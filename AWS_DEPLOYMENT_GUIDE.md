# AU Bank Developer Portal - AWS Deployment Architecture

## AWS Infrastructure Deployment Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                AWS CLOUD INFRASTRUCTURE                          │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                              ROUTE 53 (DNS)                                │ │
│  │                        aubank-devportal.com                                │ │
│  └─────────────────────────┬───────────────────────────────────────────────────┘ │
│                            │                                                     │
│  ┌─────────────────────────▼───────────────────────────────────────────────────┐ │
│  │                        CLOUDFRONT CDN                                      │ │
│  │                    (Static Asset Distribution)                             │ │
│  └─────────────────────────┬───────────────────────────────────────────────────┘ │
│                            │                                                     │
│  ┌─────────────────────────▼───────────────────────────────────────────────────┐ │
│  │                   APPLICATION LOAD BALANCER                                │ │
│  │                        (SSL Termination)                                   │ │
│  │                     ACM Certificate Manager                                │ │
│  └─────────────────────────┬───────────────────────────────────────────────────┘ │
│                            │                                                     │
│                            │                                                     │
│  ┌─────────────────────────▼───────────────────────────────────────────────────┐ │
│  │                         VPC (Virtual Private Cloud)                        │ │
│  │                         CIDR: 10.0.0.0/16                                  │ │
│  │                                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐   │ │
│  │  │                    PUBLIC SUBNETS                                   │   │ │
│  │  │                                                                     │   │ │
│  │  │  ┌─────────────────┐              ┌─────────────────┐               │   │ │
│  │  │  │   AZ-1a (us-east-1a)          │   AZ-1b (us-east-1b)            │   │ │
│  │  │  │   10.0.1.0/24   │              │   10.0.2.0/24   │               │   │ │
│  │  │  │                 │              │                 │               │   │ │
│  │  │  │  ┌─────────────┐│              │  ┌─────────────┐│               │   │ │
│  │  │  │  │   EC2       ││              │  │   EC2       ││               │   │ │
│  │  │  │  │  Instance   ││              │  │  Instance   ││               │   │ │
│  │  │  │  │             ││              │  │             ││               │   │ │
│  │  │  │  │  NodeJS     ││              │  │  NodeJS     ││               │   │ │
│  │  │  │  │  Express    ││              │  │  Express    ││               │   │ │
│  │  │  │  │  React App  ││              │  │  React App  ││               │   │ │
│  │  │  │  │             ││              │  │             ││               │   │ │
│  │  │  │  │  Port 5000  ││              │  │  Port 5000  ││               │   │ │
│  │  │  │  └─────────────┘│              │  └─────────────┘│               │   │ │
│  │  │  └─────────────────┘              └─────────────────┘               │   │ │
│  │  └─────────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐   │ │
│  │  │                    PRIVATE SUBNETS                                  │   │ │
│  │  │                                                                     │   │ │
│  │  │  ┌─────────────────┐              ┌─────────────────┐               │   │ │
│  │  │  │   AZ-1a (us-east-1a)          │   AZ-1b (us-east-1b)            │   │ │
│  │  │  │   10.0.3.0/24   │              │   10.0.4.0/24   │               │   │ │
│  │  │  │                 │              │                 │               │   │ │
│  │  │  │  ┌─────────────┐│              │  ┌─────────────┐│               │   │ │
│  │  │  │  │    RDS      ││              │  │    RDS      ││               │   │ │
│  │  │  │  │ PostgreSQL  ││              │  │ PostgreSQL  ││               │   │ │
│  │  │  │  │  (Primary)  ││              │  │ (Read Replica)│               │   │ │
│  │  │  │  │             ││              │  │             ││               │   │ │
│  │  │  │  │  Port 5432  ││              │  │  Port 5432  ││               │   │ │
│  │  │  │  └─────────────┘│              │  └─────────────┘│               │   │ │
│  │  │  └─────────────────┘              └─────────────────┘               │   │ │
│  │  └─────────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐   │ │
│  │  │                    NAT GATEWAY                                      │   │ │
│  │  │              (Outbound Internet Access)                             │   │ │
│  │  └─────────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                             │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                           ADDITIONAL AWS SERVICES                          │ │
│  │                                                                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │      S3      │  │  CloudWatch  │  │    Secrets   │  │   Parameter  │  │ │
│  │  │  Static      │  │  Monitoring  │  │   Manager    │  │    Store     │  │ │
│  │  │  Assets      │  │   & Logs     │  │              │  │              │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │ │
│  │                                                                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │     IAM      │  │   ECR        │  │   Auto       │  │   EventBridge │  │ │
│  │  │   Roles &    │  │  Container   │  │  Scaling     │  │   Scheduler   │  │ │
│  │  │  Policies    │  │  Registry    │  │   Groups     │  │              │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │ │
│  │                                                                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │   Lambda     │  │    SES       │  │    SNS       │  │     SQS      │  │ │
│  │  │  Functions   │  │   Email      │  │ Notifications│  │   Message    │  │ │
│  │  │              │  │   Service    │  │              │  │    Queue     │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘

             ┌─────────────────────────────────────────────────────────┐
             │                  EXTERNAL INTEGRATIONS                 │
             │                                                         │
             │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
             │  │   Banking   │  │   Payment   │  │   Identity  │     │
             │  │    Core     │  │  Gateways   │  │  Providers  │     │
             │  │   Systems   │  │             │  │             │     │
             │  └─────────────┘  └─────────────┘  └─────────────┘     │
             └─────────────────────────────────────────────────────────┘
```

## AWS Services Architecture Overview

### 1. **Network Layer (VPC & Subnets)**

#### VPC Configuration
```yaml
VPC:
  CIDR: 10.0.0.0/16
  Region: us-east-1
  Availability Zones: us-east-1a, us-east-1b

Public Subnets:
  - AZ1: 10.0.1.0/24 (us-east-1a)
  - AZ2: 10.0.2.0/24 (us-east-1b)

Private Subnets:
  - AZ1: 10.0.3.0/24 (us-east-1a) 
  - AZ2: 10.0.4.0/24 (us-east-1b)
```

#### Security Groups
```yaml
Web-Tier-SG:
  Description: Security group for EC2 web servers
  Inbound Rules:
    - Port 80: 0.0.0.0/0 (HTTP)
    - Port 443: 0.0.0.0/0 (HTTPS)
    - Port 5000: Load Balancer SG (Application)
    - Port 22: Bastion Host SG (SSH)
  Outbound Rules:
    - All traffic: 0.0.0.0/0

Database-Tier-SG:
  Description: Security group for RDS instances
  Inbound Rules:
    - Port 5432: Web-Tier-SG (PostgreSQL)
  Outbound Rules:
    - None

Load-Balancer-SG:
  Description: Security group for Application Load Balancer
  Inbound Rules:
    - Port 80: 0.0.0.0/0 (HTTP)
    - Port 443: 0.0.0.0/0 (HTTPS)
  Outbound Rules:
    - Port 5000: Web-Tier-SG
```

### 2. **Compute Layer (EC2 Instances)**

#### EC2 Instance Configuration
```yaml
Instance Type: t3.medium (2 vCPU, 4 GB RAM)
Operating System: Amazon Linux 2023
Storage: 
  - Root Volume: 20 GB gp3 SSD
  - Application Volume: 10 GB gp3 SSD
Key Pair: aubank-devportal-keypair
User Data Script: bootstrap-script.sh
```

#### Launch Template
```yaml
LaunchTemplate:
  Name: aubank-devportal-template
  ImageId: ami-0abcdef1234567890
  InstanceType: t3.medium
  SecurityGroupIds: 
    - sg-web-tier
  IamInstanceProfile: EC2-DevPortal-Role
  UserData: |
    #!/bin/bash
    yum update -y
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    yum install -y nodejs git
    npm install -g pm2
    
    # Application deployment
    cd /opt
    git clone https://github.com/aubank/developer-portal.git
    cd developer-portal
    npm ci --only=production
    npm run build
    
    # Configure environment
    cat > .env << EOF
    NODE_ENV=production
    DATABASE_URL=${DATABASE_URL}
    SESSION_SECRET=${SESSION_SECRET}
    PORT=5000
    EOF
    
    # Start application with PM2
    pm2 start npm --name "aubank-devportal" -- start
    pm2 startup
    pm2 save
```

### 3. **Database Layer (RDS)**

#### RDS Configuration
```yaml
RDS Primary:
  Engine: PostgreSQL 15.4
  Instance Class: db.t3.medium
  Storage: 100 GB gp3
  Multi-AZ: true
  Subnet Group: private-subnet-group
  Security Group: database-tier-sg
  Backup Retention: 7 days
  Monitoring: Enhanced monitoring enabled

RDS Read Replica:
  Engine: PostgreSQL 15.4
  Instance Class: db.t3.medium
  Source DB: primary-db
  Availability Zone: us-east-1b
  Security Group: database-tier-sg
```

### 4. **Load Balancing & Auto Scaling**

#### Application Load Balancer
```yaml
ALB Configuration:
  Name: aubank-devportal-alb
  Scheme: internet-facing
  Type: application
  Subnets: 
    - public-subnet-1a
    - public-subnet-1b
  Security Groups:
    - load-balancer-sg

Target Groups:
  - Name: aubank-devportal-tg
    Protocol: HTTP
    Port: 5000
    Health Check:
      Path: /api/health
      Interval: 30 seconds
      Timeout: 5 seconds
      Healthy Threshold: 2
      Unhealthy Threshold: 3

Listeners:
  - Port: 80
    Protocol: HTTP
    Action: Redirect to HTTPS
  - Port: 443
    Protocol: HTTPS
    Certificate: ACM Certificate
    Action: Forward to Target Group
```

#### Auto Scaling Group
```yaml
Auto Scaling Group:
  Name: aubank-devportal-asg
  Launch Template: aubank-devportal-template
  Min Size: 2
  Max Size: 6
  Desired Capacity: 2
  Target Groups: aubank-devportal-tg
  Subnets:
    - public-subnet-1a
    - public-subnet-1b

Scaling Policies:
  Scale Up:
    Metric: CPU Utilization > 70%
    Cooldown: 300 seconds
    Adjustment: +1 instance
  
  Scale Down:
    Metric: CPU Utilization < 30%
    Cooldown: 300 seconds
    Adjustment: -1 instance
```

### 5. **Storage & Content Delivery**

#### S3 Buckets
```yaml
Static Assets Bucket:
  Name: aubank-devportal-static-assets
  Purpose: Static files, images, documentation
  Versioning: Enabled
  Encryption: AES-256
  Public Access: Blocked
  CORS: Configured for CloudFront

Backup Bucket:
  Name: aubank-devportal-backups
  Purpose: Database backups, application backups
  Versioning: Enabled
  Lifecycle Policy: Archive to Glacier after 30 days
  Encryption: KMS
```

#### CloudFront Distribution
```yaml
CloudFront:
  Origin: S3 Static Assets Bucket
  Alternate Origin: ALB (for API calls)
  Price Class: PriceClass_100
  Cache Behaviors:
    - PathPattern: /api/*
      Origin: ALB
      TTL: 0 (no cache)
    - PathPattern: /assets/*
      Origin: S3
      TTL: 86400 (24 hours)
  SSL Certificate: ACM Certificate
  Custom Domain: assets.aubank-devportal.com
```

### 6. **Security & Secrets Management**

#### IAM Roles & Policies
```yaml
EC2 Instance Role:
  Name: EC2-DevPortal-Role
  Policies:
    - CloudWatchAgentServerPolicy
    - Custom policy for S3 access
    - Custom policy for Secrets Manager
    - Custom policy for Parameter Store

Lambda Execution Role:
  Name: Lambda-DevPortal-Role
  Policies:
    - AWSLambdaBasicExecutionRole
    - Custom policy for RDS access
    - Custom policy for SES

RDS Enhanced Monitoring Role:
  Name: rds-monitoring-role
  Policies:
    - AmazonRDSEnhancedMonitoringRole
```

#### Secrets Manager
```yaml
Database Credentials:
  Name: aubank-devportal/db/credentials
  Description: PostgreSQL database credentials
  Value:
    username: dbadmin
    password: <auto-generated>
    engine: postgres
    host: <rds-endpoint>
    port: 5432
    dbname: aubank_devportal

Application Secrets:
  Name: aubank-devportal/app/secrets
  Description: Application configuration secrets
  Value:
    SESSION_SECRET: <auto-generated>
    API_ENCRYPTION_KEY: <auto-generated>
    JWT_SECRET: <auto-generated>
```

### 7. **Monitoring & Logging**

#### CloudWatch Configuration
```yaml
Log Groups:
  - /aws/ec2/aubank-devportal/application
  - /aws/ec2/aubank-devportal/access
  - /aws/rds/instance/aubank-devportal-db/postgresql

Metrics:
  - EC2 CPU Utilization
  - EC2 Memory Utilization
  - ALB Request Count
  - ALB Response Time
  - RDS CPU Utilization
  - RDS Database Connections
  - RDS Read/Write IOPS

Alarms:
  High CPU:
    Metric: EC2 CPU Utilization
    Threshold: > 80%
    Actions: SNS notification
  
  High Database Connections:
    Metric: RDS Database Connections
    Threshold: > 80% of max
    Actions: SNS notification
  
  Application Errors:
    Metric: ALB 5XX errors
    Threshold: > 10 errors in 5 minutes
    Actions: SNS notification + Lambda function
```

### 8. **Backup & Disaster Recovery**

#### RDS Automated Backups
```yaml
Backup Configuration:
  Automated Backups: Enabled
  Backup Retention Period: 7 days
  Backup Window: 03:00-04:00 UTC
  Maintenance Window: Sun 04:00-05:00 UTC

Manual Snapshots:
  Frequency: Weekly
  Retention: 30 days
  Cross-Region Copy: Enabled (us-west-2)
```

#### EC2 Instance Backups
```yaml
EBS Snapshots:
  Frequency: Daily
  Retention: 7 days
  Tags: Environment=production, Application=aubank-devportal

AMI Creation:
  Frequency: Weekly
  Retention: 4 weeks
  Automation: Lambda function with EventBridge
```

## Detailed Deployment Steps

### Phase 1: AWS Infrastructure Setup

#### 1.1 VPC and Network Setup
```bash
# Create VPC
aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=aubank-devportal-vpc}]'

# Create Internet Gateway
aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=aubank-devportal-igw}]'

# Create Subnets
aws ec2 create-subnet \
  --vpc-id vpc-12345678 \
  --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=public-subnet-1a}]'

aws ec2 create-subnet \
  --vpc-id vpc-12345678 \
  --cidr-block 10.0.2.0/24 \
  --availability-zone us-east-1b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=public-subnet-1b}]'

aws ec2 create-subnet \
  --vpc-id vpc-12345678 \
  --cidr-block 10.0.3.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=private-subnet-1a}]'

aws ec2 create-subnet \
  --vpc-id vpc-12345678 \
  --cidr-block 10.0.4.0/24 \
  --availability-zone us-east-1b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=private-subnet-1b}]'
```

#### 1.2 Security Groups Creation
```bash
# Create Web Tier Security Group
aws ec2 create-security-group \
  --group-name web-tier-sg \
  --description "Security group for web servers" \
  --vpc-id vpc-12345678

# Add rules to Web Tier SG
aws ec2 authorize-security-group-ingress \
  --group-id sg-web-tier \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id sg-web-tier \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id sg-web-tier \
  --protocol tcp \
  --port 5000 \
  --source-group sg-load-balancer

# Create Database Tier Security Group
aws ec2 create-security-group \
  --group-name database-tier-sg \
  --description "Security group for database servers" \
  --vpc-id vpc-12345678

aws ec2 authorize-security-group-ingress \
  --group-id sg-database-tier \
  --protocol tcp \
  --port 5432 \
  --source-group sg-web-tier
```

### Phase 2: Database Setup

#### 2.1 RDS Subnet Group
```bash
# Create DB Subnet Group
aws rds create-db-subnet-group \
  --db-subnet-group-name aubank-devportal-subnet-group \
  --db-subnet-group-description "Subnet group for AU Bank Developer Portal" \
  --subnet-ids subnet-private-1a subnet-private-1b \
  --tags Key=Name,Value=aubank-devportal-subnet-group
```

#### 2.2 RDS Instance Creation
```bash
# Create RDS PostgreSQL Instance
aws rds create-db-instance \
  --db-instance-identifier aubank-devportal-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.4 \
  --master-username dbadmin \
  --master-user-password "$(aws secretsmanager get-random-password --exclude-characters '"@/\' --password-length 16 --query 'RandomPassword' --output text)" \
  --allocated-storage 100 \
  --storage-type gp3 \
  --vpc-security-group-ids sg-database-tier \
  --db-subnet-group-name aubank-devportal-subnet-group \
  --backup-retention-period 7 \
  --multi-az \
  --storage-encrypted \
  --monitoring-interval 60 \
  --monitoring-role-arn arn:aws:iam::account:role/rds-monitoring-role \
  --tags Key=Name,Value=aubank-devportal-primary-db
```

### Phase 3: Application Deployment

#### 3.1 Create Launch Template
```bash
# Create Launch Template
aws ec2 create-launch-template \
  --launch-template-name aubank-devportal-template \
  --launch-template-data file://launch-template.json
```

**launch-template.json:**
```json
{
  "ImageId": "ami-0abcdef1234567890",
  "InstanceType": "t3.medium",
  "KeyName": "aubank-devportal-keypair",
  "SecurityGroupIds": ["sg-web-tier"],
  "IamInstanceProfile": {
    "Name": "EC2-DevPortal-InstanceProfile"
  },
  "UserData": "IyEvYmluL2Jhc2gKIyBCYXNlNjQgZW5jb2RlZCBzdGFydHVwIHNjcmlwdA==",
  "TagSpecifications": [
    {
      "ResourceType": "instance",
      "Tags": [
        {
          "Key": "Name",
          "Value": "aubank-devportal-instance"
        }
      ]
    }
  ]
}
```

#### 3.2 Create Auto Scaling Group
```bash
# Create Target Group
aws elbv2 create-target-group \
  --name aubank-devportal-tg \
  --protocol HTTP \
  --port 5000 \
  --vpc-id vpc-12345678 \
  --health-check-path /api/health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3

# Create Application Load Balancer
aws elbv2 create-load-balancer \
  --name aubank-devportal-alb \
  --subnets subnet-public-1a subnet-public-1b \
  --security-groups sg-load-balancer \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4

# Create Auto Scaling Group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name aubank-devportal-asg \
  --launch-template LaunchTemplateName=aubank-devportal-template \
  --min-size 2 \
  --max-size 6 \
  --desired-capacity 2 \
  --target-group-arns arn:aws:elasticloadbalancing:us-east-1:account:targetgroup/aubank-devportal-tg \
  --vpc-zone-identifier "subnet-public-1a,subnet-public-1b" \
  --health-check-type ELB \
  --health-check-grace-period 300 \
  --tags Key=Name,Value=aubank-devportal-asg,PropagateAtLaunch=true
```

### Phase 4: SSL Certificate & Domain Setup

#### 4.1 Request SSL Certificate
```bash
# Request SSL Certificate from ACM
aws acm request-certificate \
  --domain-name aubank-devportal.com \
  --subject-alternative-names *.aubank-devportal.com \
  --validation-method DNS \
  --tags Key=Name,Value=aubank-devportal-ssl
```

#### 4.2 Route 53 Configuration
```bash
# Create Route 53 Hosted Zone
aws route53 create-hosted-zone \
  --name aubank-devportal.com \
  --caller-reference $(date +%s) \
  --hosted-zone-config Comment="AU Bank Developer Portal"

# Create DNS records
aws route53 change-resource-record-sets \
  --hosted-zone-id Z123456789 \
  --change-batch file://dns-records.json
```

### Phase 5: Monitoring & Logging Setup

#### 5.1 CloudWatch Configuration
```bash
# Create Log Groups
aws logs create-log-group \
  --log-group-name /aws/ec2/aubank-devportal/application

aws logs create-log-group \
  --log-group-name /aws/ec2/aubank-devportal/access

# Create CloudWatch Alarms
aws cloudwatch put-metric-alarm \
  --alarm-name "High-CPU-Utilization" \
  --alarm-description "Alarm when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:account:alerts-topic
```

## Cost Estimation

### Monthly AWS Costs (Production Environment)

| Service | Configuration | Monthly Cost (USD) |
|---------|---------------|-------------------|
| **EC2 Instances** | 2x t3.medium (24/7) | $60.00 |
| **RDS PostgreSQL** | db.t3.medium Multi-AZ | $85.00 |
| **Application Load Balancer** | 1 ALB with basic usage | $22.00 |
| **S3 Storage** | 100GB standard storage | $3.00 |
| **CloudFront** | 1TB data transfer | $85.00 |
| **VPC** | NAT Gateway | $45.00 |
| **Route 53** | Hosted zone + queries | $5.00 |
| **CloudWatch** | Logs and metrics | $15.00 |
| **Secrets Manager** | 5 secrets | $2.50 |
| **ACM Certificate** | SSL certificate | $0.00 |
| **Data Transfer** | Outbound data | $20.00 |
| **Backup Storage** | EBS snapshots + RDS | $10.00 |

**Total Monthly Cost: ~$352.50 USD**

### Cost Optimization Strategies

1. **Reserved Instances**: Save 30-60% on EC2 costs
2. **Spot Instances**: Use for non-critical environments
3. **S3 Intelligent Tiering**: Automatic cost optimization
4. **CloudWatch Log Retention**: Set appropriate retention periods
5. **Auto Scaling**: Scale down during low usage

## Security Best Practices

### 1. Network Security
- **VPC Isolation**: Private subnets for databases
- **Security Groups**: Principle of least privilege
- **NACLs**: Additional network-level security
- **VPC Flow Logs**: Network traffic monitoring

### 2. Application Security
- **WAF Integration**: Web Application Firewall
- **SSL/TLS**: End-to-end encryption
- **API Rate Limiting**: Protect against abuse
- **Input Validation**: Server-side validation

### 3. Database Security
- **Encryption at Rest**: RDS encrypted storage
- **Encryption in Transit**: SSL connections
- **Database Secrets**: Secrets Manager rotation
- **Access Control**: IAM database authentication

### 4. Infrastructure Security
- **IAM Roles**: Fine-grained permissions
- **CloudTrail**: Audit logging
- **Config Rules**: Compliance monitoring
- **Systems Manager**: Patch management

## Disaster Recovery Plan

### Recovery Time Objectives (RTO)
- **Database**: 15 minutes (Multi-AZ automatic failover)
- **Application**: 10 minutes (Auto Scaling Group replacement)
- **Full Environment**: 4 hours (Cross-region deployment)

### Recovery Point Objectives (RPO)
- **Database**: 5 minutes (continuous backup)
- **Application**: 24 hours (daily AMI snapshots)
- **Configuration**: 0 minutes (Infrastructure as Code)

### Backup Strategy
1. **Automated RDS Backups**: 7-day retention
2. **EBS Snapshots**: Daily automated snapshots
3. **Cross-Region Replication**: Critical data backup
4. **Application Code**: Git repository backup

## Conclusion

This AWS deployment architecture provides a production-ready, scalable, and secure infrastructure for the AU Bank Internal Developer Portal. The design incorporates AWS best practices for:

- **High Availability**: Multi-AZ deployment across multiple availability zones
- **Scalability**: Auto Scaling Groups and load balancing
- **Security**: Defense in depth with multiple security layers
- **Monitoring**: Comprehensive CloudWatch monitoring and alerting
- **Cost Optimization**: Right-sized instances with scaling capabilities
- **Disaster Recovery**: Automated backups and cross-region replication

The architecture supports the full feature set of the banking API portal while maintaining enterprise-grade security and compliance requirements.