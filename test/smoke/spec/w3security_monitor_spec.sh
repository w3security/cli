#shellcheck shell=sh

Describe "w3security monitor command"
  Before w3security_login
  After w3security_logout

  Describe "monitor npm project"
    run_monitor_in_subfolder() {
      cd ../fixtures/basic-npm || return
      w3security monitor
    }

    It "monitors a project in the same folder"
      When run run_monitor_in_subfolder
      The status should be success
      The output should include "Explore this snapshot at https://app.w3security.io/org/"
      The output should include "Notifications about newly disclosed issues related to these dependencies will be emailed to you."
    End

    It "monitors a project when pointing to a folder"
      When run w3security monitor ../fixtures/basic-npm
      The status should be success
      The output should include "Explore this snapshot at https://app.w3security.io/org/"
      The output should include "Notifications about newly disclosed issues related to these dependencies will be emailed to you."
    End

    It "monitors a project when pointing to a file"
      When run w3security monitor --file=../fixtures/basic-npm/package.json
      The status should be success
      The output should include "Explore this snapshot at https://app.w3security.io/org/"
      The output should include "Notifications about newly disclosed issues related to these dependencies will be emailed to you."
    End
  End

  Describe "monitor npm project with JSON output"
    It "monitors a project and outputs a valid JSON"
      When run w3security monitor ../fixtures/basic-npm --json
      The status should be success # issues found
      The output should include '"ok": true,'
      The stderr should equal ""
      The result of function check_valid_json should be success
    End
  End
End
