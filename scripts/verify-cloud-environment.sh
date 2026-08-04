#!/usr/bin/env bash
set -euo pipefail

required=(git gh node python3 curl jq rg)
failed=0

for command_name in "${required[@]}"; do
  if command -v "$command_name" >/dev/null 2>&1; then
    printf 'OK  %s\n' "$command_name"
  else
    printf 'MISSING  %s\n' "$command_name"
    failed=1
  fi
done

if command -v hubspot >/dev/null 2>&1; then
  printf 'AVAILABLE  hubspot (run hubspot whoami before CRM access)\n'
else
  printf 'OPTIONAL  hubspot CLI is not installed in this environment\n'
fi

if [ "$failed" -ne 0 ]; then
  exit 1
fi

