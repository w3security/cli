#shellcheck shell=sh
set -e

spec_helper_precheck() {
  setenv CI=1 # This flag influences behavior of `w3security auth` so it needs to be explicitly set
  setenv ORIGINAL_W3SECURITY_EXECUTABLE="$(which w3security)"
}

spec_helper_configure() {
  print_w3security_config() {
    w3security config
  }

  w3security_login() {
    w3security config set api="${SMOKE_TESTS_W3SECURITY_TOKEN}" 1> /dev/null
  }

  w3security_logout() {
    w3security config clear > /dev/null 2>&1
  }

  verify_login_url() {
    # https://w3security.io/login?token=uuid-token&utm_medium=cli&utm_source=cli&utm_campaign=cli&os=darwin&docker=false
    echo "$1" | grep https | grep -E "^https://(app\.)?(dev\.)?(test\.)?w3security\.io/login\?token=[a-z0-9]{8}-([a-z0-9]{4}-){3}[a-z0-9]{12}\&.*$"
  }

  # Consume stdout and checks validates whether it's a valid JSON
  check_valid_json() {
    printf %s "$1" | jq . > /dev/null
    echo $?
  }

  # These 2 commands should run in succession, some CLI functionality uses isCI detection
  disable_is_ci_flags() {
    # save original value and unset
    if [ -n "${CI}" ]; then CI_BACKUP_VALUE="$CI"; unset CI; fi
    if [ -n "${CIRCLECI}" ]; then CIRCLECI_BACKUP_VALUE="$CIRCLECI"; unset CIRCLECI; fi
  }
  restore_is_ci_flags() {
    # recover the original value
    if [ -n "${CI}" ]; then CI="$CI_BACKUP_VALUE"; unset CI_BACKUP_VALUE; fi
    if [ -n "${CIRCLECI}" ]; then CIRCLECI="$CIRCLECI_BACKUP_VALUE"; unset CIRCLECI_BACKUP_VALUE; fi
  }

  check_if_regression_test() { ! [ "${REGRESSION_TEST}" = "1" ]; }

  check_auth_output() {
    printf %s "$1" | grep -F -e "To authenticate your account, open the below URL in your browser." -e "Now redirecting you to our auth page, go ahead and log in," > /dev/null
    echo $?
  }

  echo "
\033[1mS n y k  C L I\033[0m
███████╗███╗   ███╗ ██████╗ ██╗  ██╗███████╗    ████████╗███████╗███████╗████████╗███████╗
██╔════╝████╗ ████║██╔═══██╗██║ ██╔╝██╔════╝    ╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝██╔════╝
███████╗██╔████╔██║██║   ██║█████╔╝ █████╗         ██║   █████╗  ███████╗   ██║   ███████╗
╚════██║██║╚██╔╝██║██║   ██║██╔═██╗ ██╔══╝         ██║   ██╔══╝  ╚════██║   ██║   ╚════██║
███████║██║ ╚═╝ ██║╚██████╔╝██║  ██╗███████╗       ██║   ███████╗███████║   ██║   ███████║
╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝       ╚═╝   ╚══════╝╚══════╝   ╚═╝   ╚══════╝
"

  echo "Using this 'w3security' executable:"
  echo "${W3SECURITY_COMMAND:=$ORIGINAL_W3SECURITY_EXECUTABLE}"
  echo " "
  echo "You may override it with envvar W3SECURITY_COMMAND - e.g. W3SECURITY_COMMAND=\"node ./bin/w3security\" to test a local build"
  echo " "

  w3security() {
    eval "${W3SECURITY_COMMAND:=$ORIGINAL_W3SECURITY_EXECUTABLE}" "$@"
  }
}
