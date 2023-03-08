#!/bin/bash

OUTPUT_FILE=w3security-result.json
MONITOR_OUTPUT_FILE=w3security-monitor-result.json
ERROR_FILE=w3security-error.log
HTML_FILE=w3security_report.html
W3SECURITY_COMMAND="$1"
W3SECURITY_PARAMS="${@:2}"
ADDITIONAL_ENV=""

if [ -z "${USER_ID}" ]; then
  USER_ID=$(id -u)
fi

USER_NAME=$(getent passwd "${USER_ID}" | awk -F ':' '{print $1}')

if [ "${USER_NAME}" != "" ] && [ "${USER_NAME}" != "root" ]; then
  usermod -d /home/node "${USER_NAME}"
fi

useradd -o -m -u "${USER_ID}" -d /home/node docker-user 2>/dev/null

runCmdAsDockerUser() {
  su docker-user -m -c "$1"

  return $?
}

exitWithMsg() {
  echo "Failed to run the process ..."

  if [ -f "$1" ]; then
    cat "$1"
  else
    echo "$1"
  fi

  exit "$2"
}

TEST_SETTINGS=""
PROJECT_SUBDIR=""

if [ -n "${TARGET_FILE}" ]; then
  if [ ! -f "${PROJECT_PATH}/${PROJECT_FOLDER}/${TARGET_FILE}" ]; then
    exitWithMsg "\"${PROJECT_PATH}/${PROJECT_FOLDER}/${TARGET_FILE}\" does not exist" 2
  fi

  PROJECT_SUBDIR=$(dirname "${TARGET_FILE}")
  MANIFEST_NAME=$(basename "${TARGET_FILE}")
  TEST_SETTINGS="--file=${MANIFEST_NAME} "
fi

if [ -n "${ORGANIZATION}" ]; then
  TEST_SETTINGS="${TEST_SETTINGS} --org=${ORGANIZATION}"
fi

W3SECURITY_PARAMS="${W3SECURITY_PARAMS} ${TEST_SETTINGS}"

if [ -z "${W3SECURITY_TOKEN}" ]; then
  exitWithMsg "Missing \${W3SECURITY_TOKEN}" 2
fi

if [ -n "${ENV_FLAGS}" ]; then
  ADDITIONAL_ENV="-- ${ENV_FLAGS}"
fi

cd "${PROJECT_PATH}/${PROJECT_FOLDER}/${PROJECT_SUBDIR}" ||
  exitWithMsg "Can't cd to ${PROJECT_PATH}/${PROJECT_FOLDER}/${PROJECT_SUBDIR}" 2

runCmdAsDockerUser "PATH=${PATH} w3security ${W3SECURITY_COMMAND} --json ${W3SECURITY_PARAMS} \
${ADDITIONAL_ENV} > \"${OUTPUT_FILE}\" 2>\"${ERROR_FILE}\""

RC=$?

if [ "$RC" -ne "0" ] && [ "$RC" -ne "1" ]; then
  exitWithMsg "${OUTPUT_FILE}" "$RC"
fi

runCmdAsDockerUser "touch \"${PROJECT_PATH}/${PROJECT_FOLDER}/${HTML_FILE}\""

if [ -n "$MONITOR" ]; then
  echo "Monitoring & generating report ..."
  runCmdAsDockerUser "PATH=$PATH w3security monitor --json ${W3SECURITY_PARAMS} ${ADDITIONAL_ENV} > ${MONITOR_OUTPUT_FILE} 2>$ERROR_FILE"
fi

runCmdAsDockerUser "cat \"${OUTPUT_FILE}\" | w3security-to-html >> \"${PROJECT_PATH}/${PROJECT_FOLDER}/${HTML_FILE}\""

if [ $RC -ne "0" ]; then
  exitWithMsg "${OUTPUT_FILE}" "$RC"
fi

cat "${OUTPUT_FILE}"

exit "$RC"
