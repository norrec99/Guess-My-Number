# Guess My Number (1 - 10) as a NEAR contract

## Install dependencies

```
yarn
```

## Build and Deploy the contract

```
yarn build
near dev-deploy ./out/main.wasm
```

## How to Play

1. Player1 calls function `createGame` and pays 1 NEAR to do it.
2. Player2 calls function `joinGame(gameId)` with gameId, as argument and pays 1 NEAR to do it.
3. Player1 calls function `play(gameId, selectedNumber)` with gameId, selectedNumber as argument
4. Player2 calls function `play(gameId, selectedNumber)` with gameId, selectedNumber as argument
5. Players continue the game until someone win or exceed the turn limit which is 5.

## Run the game

**Create a game**

```
near call <contract-id> createGame --account_id <account-id> --amount 1
```

**Join the game**

```
near call <contract-id> joinGame '{"gameId": <game-id>}' --account_id <account-id> --amount 1
```

**Play the game**

```
near call <contract-id> play '{"gameId": <game-id>, "selectedNumber": <selected-number>}' --account_id <account-id>
```
