#!/usr/bin/env bash
#
# Checks whether forge eligibility matches expected (Runs on Atlassian).
# Exit 0 — environment is eligible (matches).
# Exit 1 — environment is not eligible (does not match).
#
# Examples:
#   ./check-forge-eligibility.sh -e production   → exit 0 (matches)
#   ./check-forge-eligibility.sh -e vzakharchenko → exit 1 (does not match)
#
set -e

ENV=""
while getopts "e:" opt; do
  case $opt in
    e) ENV="$OPTARG" ;;
    *) echo "Usage: $0 -e <environment>"; exit 2 ;;
  esac
done

if [[ -z "$ENV" ]]; then
  echo "Usage: $0 -e <environment>"
  echo "Example: $0 -e production"
  exit 2
fi

OUTPUT=$(forge eligibility -e "$ENV" 2>&1) || true

if echo "$OUTPUT" | grep -q "is eligible for the Runs on Atlassian program"; then
  echo "Forge eligibility matches: environment [$ENV] is eligible for Runs on Atlassian."
  exit 0
else
  echo "Forge eligibility does not match: environment [$ENV] is not eligible for Runs on Atlassian."
  echo "$OUTPUT" | sed 's/^/  /'
  exit 1
fi
