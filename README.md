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

1. Player calls function `createGame`
2. Player calls function `play(gameId, selectedNumber)` with gameId, selectedNumber as argument
3. Player continues the game
4. The plays continue until someone win

## Run the game

**Create a game**

```
near call <contract-id> createGame --account_id <account-id>
```

**Play the game**

```
near call <contract-id> play '{"gameId": <game-id>, "selectedNumber": <selected-number>}' --account_id <account-id>
```
