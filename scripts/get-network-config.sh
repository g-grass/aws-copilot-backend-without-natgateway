set -eu
readonly AWS_PROFILE=$1
readonly VPC_CIDR=10.0.0.0/16

readonly vpcId=$(aws ec2 describe-vpcs --profile ${AWS_PROFILE} \
    --filters "Name=cidr,Values=${VPC_CIDR}" \
    --query "Vpcs[0].VpcId" \
    --output text)

subnets=$(aws ec2 describe-subnets --profile ${AWS_PROFILE} \
    --filters "Name=vpcId,Values=${vpcId}" \
    --query "Subnets[*].SubnetId" --output text | tr '\t' ',')


cat << EOF
${vpcId}
${subnets}
EOF