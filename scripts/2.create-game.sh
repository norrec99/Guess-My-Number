#!/usr/bin/env bash
set -e

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$PLAYER1" ] && echo "Missing \$PLAYER1 environment variable" && exit 1

echo
echo 'About to call say() on the contract'
echo near call \$CONTRACT createGame --account_id \$PLAYER1 --amount \$1
echo
echo \$CONTRACT is $CONTRACT
echo \$PLAYER1 is $PLAYER1
echo \$1 is [ $1 NEAR ] '(optionally attached amount)'
echo
near call $CONTRACT createGame --account_id $PLAYER1 --amount $1