#!/usr/bin/env bash

GREEN="\033[0;32m"
RED="\033[0;31m"
NC="\033[0m"

passed() {
  echo -e "${GREEN}Passed${NC} $1"
}

failed() {
  echo -e "${RED}Failed${NC} $1"
}