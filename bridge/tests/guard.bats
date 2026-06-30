#!/usr/bin/env bats
# Smoke tests for the env / project-dir guards introduced by AUDIT-027.
# Run via `bats bridge/tests/` (install: https://bats-core.readthedocs.io/).
# These tests are *function-level* — they source the lib directly rather
# than spawning the bridge — so they finish in milliseconds and can be
# part of every PR's pre-merge check.

setup() {
  # shellcheck source=/dev/null
  . "${BATS_TEST_DIRNAME}/../lib/guard.sh"
}

# --- sc_assert_env_ident ----------------------------------------------------

@test "sc_assert_env_ident: accepts empty (caller applies default)" {
  run sc_assert_env_ident SC_REVIEWER_MODEL ""
  [ "$status" -eq 0 ]
}

@test "sc_assert_env_ident: accepts provider/model.major-minor" {
  run sc_assert_env_ident SC_REVIEWER_MODEL "zai-coding-plan/glm-5.2"
  [ "$status" -eq 0 ]
}

@test "sc_assert_env_ident: accepts kebab agent name" {
  run sc_assert_env_ident SC_REVIEWER_AGENT "sc-echo-reviewer"
  [ "$status" -eq 0 ]
}

@test "sc_assert_env_ident: accepts leading dash (single argv element; flag-injection blocked by whitespace refusal, not by character set)" {
  run sc_assert_env_ident SC_REVIEWER_MODEL "--dangerous-flag"
  [ "$status" -eq 0 ]
  # A leading dash is allowed because '-' is in the allow-list; the
  # CLI argv quoting prevents the whole value from being re-tokenized,
  # and the env-supplied string lands as a single argv element. The
  # primary attack surface — splitting into multiple argv elements via
  # whitespace — is closed by the whitespace-refusal test below.
}

@test "sc_assert_env_ident: refuses whitespace (would split argv)" {
  run sc_assert_env_ident SC_REVIEWER_MODEL "opus --dangerous-flag"
  [ "$status" -eq 1 ]
}

@test "sc_assert_env_ident: refuses shell metacharacters" {
  run sc_assert_env_ident SC_REVIEWER_MODEL 'opus;rm -rf .'
  [ "$status" -eq 1 ]
  run sc_assert_env_ident SC_REVIEWER_MODEL 'opus$(id)'
  [ "$status" -eq 1 ]
  run sc_assert_env_ident SC_REVIEWER_MODEL 'opus`id`'
  [ "$status" -eq 1 ]
}

# --- sc_assert_project_dir -------------------------------------------------

@test "sc_assert_project_dir: accepts a real project subdirectory" {
  run sc_assert_project_dir "${BATS_TEST_DIRNAME}"
  [ "$status" -eq 0 ]
}

@test "sc_assert_project_dir: refuses empty" {
  run sc_assert_project_dir ""
  [ "$status" -eq 1 ]
}

@test "sc_assert_project_dir: refuses root (containment bypass)" {
  run sc_assert_project_dir "/"
  [ "$status" -eq 1 ]
}

@test "sc_assert_project_dir: refuses bare HOME" {
  HOME=/tmp/sc-fake-home
  run sc_assert_project_dir "${HOME}"
  [ "$status" -eq 1 ]
}

# --- _sc_uint_or (defined in lib/run-review.sh) ----------------------------

@test "_sc_uint_or: returns value when all digits" {
  # shellcheck source=/dev/null
  . "${BATS_TEST_DIRNAME}/../lib/run-review.sh"
  run _sc_uint_or SC_TIMEOUT "600" 300
  [ "$status" -eq 0 ]
  [ "$output" = "600" ]
}

@test "_sc_uint_or: returns default when empty" {
  . "${BATS_TEST_DIRNAME}/../lib/run-review.sh"
  run _sc_uint_or SC_TIMEOUT "" 300
  [ "$status" -eq 0 ]
  [ "$output" = "300" ]
}

@test "_sc_uint_or: falls back when value has letters (self-DoS guard)" {
  . "${BATS_TEST_DIRNAME}/../lib/run-review.sh"
  run _sc_uint_or SC_TIMEOUT "600s" 300
  [ "$status" -eq 0 ]
  # Output includes the warning on stderr AND the default on stdout;
  # `bats run` merges both. We only assert the trailing default.
  [[ "$output" == *"300" ]]
}

@test "_sc_uint_or: falls back to default on negative value (leading dash not in [0-9])" {
  . "${BATS_TEST_DIRNAME}/../lib/run-review.sh"
  run _sc_uint_or SC_TIMEOUT "-5" 300
  [ "$status" -eq 0 ]
  [[ "$output" == *"300" ]]
}
