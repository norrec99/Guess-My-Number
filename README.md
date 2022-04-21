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

## How to Play without bet

1. Player1 calls function `createGame` and pays 1 NEAR to do it.
2. Player2 calls function `joinGame(id)` with id, as argument and pays 1 NEAR to do it.
3. Player1 calls function `play(id, selectedNumber)` with id and selectedNumber as arguments
4. Player2 calls function `play(id, selectedNumber)` with id and selectedNumber as arguments
5. Players continue the game until someone win or exceed the turn limit which is 6.

## Run the game

**Create a game**

```
near call <contract-id> createGame --account_id <account-id> --amount 1
```

**Join the game**

```
near call <contract-id> joinGame '{"id": <id>}' --account_id <account-id> --amount 1
```

**Play the game**

```
near call <contract-id> play '{"id": <id>, "selectedNumber": <selected-number>}' --account_id <account-id>
```

---

## How to Play with bet

1. Player1 calls function `createGame(bet)` with bet, as argument and pays "{bet}" amount of NEAR to do it.
2. Player2 calls function `joinGame(id, bet)` with id and bet, as arguments and pays exactly the same amount as Player1 to do it.
3. Player1 calls function `play(id, selectedNumber)` with id and selectedNumber as arguments
4. Player2 calls function `play(id, selectedNumber)` with id and selectedNumber as arguments
5. Players continue the game until someone win or exceed the turn limit which is 6.

## Run the game

**Create a game**

```
near call <contract-id> createGame '{"bet": <bet>}' --account_id <account-id> --amount <bet>
```

**Join the game**

```
near call <contract-id> joinGame '{"id": <id>, "bet": <bet>}' --account_id <account-id> --amount <bet>
```

**Play the game**

```
near call <contract-id> play '{"id": <id>, "selectedNumber": <selected-number>}' --account_id <account-id>
```
