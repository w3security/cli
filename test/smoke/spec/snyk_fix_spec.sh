#shellcheck shell=sh

Describe "w3security fix command logged in"
  Before w3security_login
  After w3security_logout

  Describe "supported only with FF"

    It "by default w3security fix is not supported"
      When run w3security fix
      The status should be failure
      The output should include "is not supported"
      The stderr should equal ""
    End
  End
End

Describe "w3security fix command logged out"
  Before w3security_logout

  Describe "Bubbles up auth error"

    It "not authed"
      When run w3security fix
      The status should be failure
      The output should include "Not authorised"
      The stderr should equal ""
    End
  End
End
