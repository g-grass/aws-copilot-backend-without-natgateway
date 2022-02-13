set -eu
readonly BASE_DIR=$(dirname $(greadlink -f $0))
readonly AWS_PROFILE=$1
readonly PASSWORD="$(LC_CTYPE=C tr -dc A-Za-z0-9_\!\@\#\$\%\^\&\*\(\)-+= < /dev/urandom | head -c 32)"

source ${BASE_DIR}/env.sh

readonly user_name=$(aws cognito-idp admin-create-user --profile ${AWS_PROFILE} \
    --user-pool-id ${USER_POOL_ID} \
    --username ${EMAIL} \
    --user-attributes Name=email,Value=${EMAIL} Name=email_verified,Value=true \
    --message-action SUPPRESS \
    --region ${REGION} \
    --query "User.Username" --output text)


aws cognito-idp admin-set-user-password --profile ${AWS_PROFILE} \
--user-pool-id ${USER_POOL_ID} \
--username ${user_name} \
--password ${PASSWORD} \
--permanent

cat << EOF
EMAIL:${EMAIL}
PASSWORD:${PASSWORD}
USER_NAME:${user_name}
EOF