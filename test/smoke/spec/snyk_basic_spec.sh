#shellcheck shell=sh

Describe "Snyk CLI basics"
  Describe "w3security version"
    It "prints version"
      When run w3security version
      The output should include "1." # Version should start with a (major) 1
      The status should be success
      # TODO: unusable with our current docker issues
      The stderr should equal ""
    End

    It "prints version with --version flag"
      When run w3security --version
      The output should include "1." # Version should start with a (major) 1
      The status should be success
      # TODO: unusable with our current docker issues
      The stderr should equal ""
    End
  End

  Describe "w3security help"
    It "prints help info"
      When run w3security help
      The output should include "Snyk CLI scans and monitors your projects for security vulnerabilities"
      The status should be success
      # TODO: unusable with our current docker issues
      The stderr should equal ""
    End
  End

  Describe "extensive w3security help"
    Skip if "execute only in regression test" check_if_regression_test

    It "prints help info when called with unknown argument"
      When run w3security help hello
      The output should include " Snyk CLI scans and monitors your projects for security vulnerabilities"
      The status should be success
      # TODO: unusable with our current docker issues
      The stderr should equal ""
    End

    It "prints help info when called with flag and unknown argument"
      When run w3security --help hello
      The output should include " Snyk CLI scans and monitors your projects for security vulnerabilities"
      The status should be success
      # TODO: unusable with our current docker issues
      The stderr should equal ""
    End

    It "prints specific help info for container"
      When run w3security -h container
      The output should include "test and continuously monitor container images for vulnerabilities"
      The status should be success
      # TODO: unusable with our current docker issues
      The stderr should equal ""
    End

    It "prints specific help info for iac"
      When run w3security iac -help
      The output should include "Infrastructure as Code"
      The status should be success
      # TODO: unusable with our current docker issues
      The stderr should equal ""
    End

    It "prints specific help info when called with flag and equals sign"
      When run w3security --help=iac
      The output should include "Infrastructure as Code"
      The status should be success
      # TODO: unusable with our current docker issues
      The stderr should equal ""
    End

    It "prints help info for argument with mode"
      When run w3security --help container test
      The output should include "tests container images for any known vulnerabilities"
      The status should be success
      # TODO: unusable with our current docker issues
      The stderr should equal ""
    End

    Describe "prints help info without ascii escape sequences"
      It "has NO_COLOR set"
        w3security_help_no_color() {
          NO_COLOR='' w3security help
        }

        When run w3security_help_no_color
        The output should not include "[1mN"
        The output should not include "[0m"
        The output should not include "[4mC"
      End

      It "is not tty"
        w3security_help_no_tty() {
          w3security help | cat
        }

        When run w3security_help_no_tty
        The output should not include "[1mN"
        The output should not include "[0m"
        The output should not include "[4mC"
      End
    End
  End

  Describe "w3security config"
    It "prints config"
      When run w3security config
      The stdout should equal ""
      The status should be success
    End

    It "sets config"
      When run w3security config set newkey=newvalue
      The output should include "newkey updated"
      The status should be success
      The result of "print_w3security_config()" should include "newkey: newvalue"
    End

    It "unsets config"
      When run w3security config unset newkey
      The output should include "newkey deleted"
      The status should be success
      The result of "print_w3security_config()" should not include "newkey"
      The result of "print_w3security_config()" should not include "newvalue"
    End
  End

  Describe "w3security woof"
    It "Woofs in English by default"
      When run w3security woof
      The output should include "Woof!"
      The status should be success
      The stderr should equal ""
    End

    It "Woofs in English when passed unsopported language"
      When run w3security woof --language=blalbla
      The output should include "Woof!"
      The status should be success
      The stderr should equal ""
    End

    It "Woofs in Czech when passed 'cs'"
      When run w3security woof --language=cs
      The output should include "Haf!"
      The status should be success
      The stderr should equal ""
    End
  End

  Describe "w3security --about"
    It "prints license attributions"
      When run w3security --about
      The output should include "Snyk CLI Open Source Attributions" # Version should start with a (major) 1
      The status should be success
      The stderr should equal ""
    End
  End
End
