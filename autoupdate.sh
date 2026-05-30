#!/bin/bash
set -e

# Colors (disabled when not a TTY so pipes work)
if [[ -t 1 ]]; then
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[1;33m'
  BLUE='\033[0;34m'
  CYAN='\033[0;36m'
  BOLD='\033[1m'
  RESET='\033[0m'
else
  RED= GREEN= YELLOW= BLUE= CYAN= BOLD= RESET=
fi

STEP=0
step() { STEP=$((STEP + 1)); echo -e "${CYAN}[Step ${STEP}]${RESET} ${*}"; }
section() { echo -e "\n${BOLD}${BLUE}══════════════════════════════════════════════════════════${RESET}\n${BOLD}${BLUE}  ${*}${RESET}\n${BOLD}${BLUE}══════════════════════════════════════════════════════════${RESET}"; }
run() { echo -e "${YELLOW}  →${RESET} $*"; "$@"; }

section "Root package (Forge-Secure-Notes-for-Jira)"
step "Updating dependencies (ncu -u)..."
run ncu -u --dep prod,dev,peer
step "Removing node_modules and package-lock.json..."
run rm -rf node_modules package-lock.json
step "Installing dependencies (npm i)..."
run npm i
step "Running knip..."
run npm run knip
step "Running lint:fix..."
run npm run lint:fix
step "Building..."
run npm run build:ci
step "Staging package.json and package-lock.json..."
run git add package.json package-lock.json

section "build custom-ui"
step "Updating dependencies (ncu -u)..."
cd static
run ncu -u --dep prod,dev,peer
step "Removing node_modules and package-lock.json..."
run rm -rf node_modules package-lock.json
step "Installing dependencies (npm i)..."
run npm i
step "Running knip..."
run npm run knip
step "Running lint:fix..."
run npm run lint:fix
step "Building custom ui..."
run npm run build
