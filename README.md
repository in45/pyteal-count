## Stateful Counter Example

We will create a simple stateful smart contract which will:
- Have a global variable `counter`
- Will increment `counter` each time we call the application.

## Cmds

#### deploy the App
```
yarn run algob deploy scripts/deploy.js
```

#### increment counter
```
yarn run algob deploy scripts/increment.js
```

#### test
```
yarn run algob test
```
