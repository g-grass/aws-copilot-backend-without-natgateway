set -eu
readonly BASE_DIR=$(dirname $(readlink -f $0))
readonly AWS_PROFILE=$1
readonly TABLE_NAME=my-app-dev-backend-api-creatures

aws dynamodb get-item --profile ${AWS_PROFILE} \
    --table-name ${TABLE_NAME} \
    --key file://${BASE_DIR}/config/key.json