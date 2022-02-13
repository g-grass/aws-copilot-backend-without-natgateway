set -eu
readonly BASE_DIR=$(dirname $(greadlink -f $0))
readonly AWS_PROFILE=$1
readonly PASSWORD=$2

source ${BASE_DIR}/env.sh

readonly id_token=$(aws cognito-idp admin-initiate-auth --profile ${AWS_PROFILE} \
  --user-pool-id ${USER_POOL_ID} \
  --client-id ${CLIENT_ID} \
  --auth-flow ADMIN_NO_SRP_AUTH \
  --auth-parameters "USERNAME=${EMAIL},PASSWORD=${PASSWORD}" \
  --region ${REGION} \
  --query "AuthenticationResult.IdToken" | sed "s/\"//g")

readonly identity_id=$(aws cognito-identity get-id --profile ${AWS_PROFILE} \
  --identity-pool-id ${IDENTITY_POOL_ID} \
  --logins "${COGNITO_USER_POOL}=${id_token}" \
  --region ${REGION} \
  --query "IdentityId" \
  --output text)

aws cognito-identity get-credentials-for-identity --profile ${AWS_PROFILE} \
  --identity-id ${identity_id} \
  --logins "${COGNITO_USER_POOL}=${id_token}" \
  --region ${REGION}