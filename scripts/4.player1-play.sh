#!/usr/bin/env bash
set -e

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$PLAYER1" ] && echo "Missing \$PLAYER1 environment variable" && exit 1

echo
echo 'About to call say() on the contract'
echo near call \$CONTRACT play '{"id": "$1", "selectedNumber": "$2"}' --account_id \$PLAYER1
echo
echo \$CONTRACT is $CONTRACT
echo \$PLAYER2 is $PLAYER2
echo \$1 is [ $1 ] '(game id)'
echo \$2 is [ $2 ] '(selected number)'
echo
near call $CONTRACT play '{"id": "'"$1"'", "selectedNumber": '"$2"'}' --account_id $PLAYER1