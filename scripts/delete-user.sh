set -eu
readonly BASE_DIR=$(dirname $(readlink -f $0))
readonly AWS_PROFILE=$1

source ${BASE_DIR}/env.sh

aws cognito-idp admin-delete-user --profile ${AWS_PROFILE} \
    --user-pool-id ${USER_POOL_ID} \
    --username ${USER_NAME}


echo "USER:${USER_NAME} is deleted."