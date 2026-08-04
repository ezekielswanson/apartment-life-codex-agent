#!/usr/bin/env bash
set -euo pipefail

missing=()
for command_name in curl jq rg; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    missing+=("$command_name")
  fi
done

if [ "${#missing[@]}" -gt 0 ]; then
  sudo apt-get update
  sudo apt-get install -y "${missing[@]}"
fi

bash scripts/verify-cloud-environment.sh

