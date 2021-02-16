# serverless-hypernova-vue

This project should be used as an example of how to create a Hypernova Vue Micro Frontend (MFE) Lambda, as a template. This project is not production ready, the following should be completed before thinking of deploying the lambda to production.

- Complete e2e tests for both the component and lambda handler
- Complete unit tests for both the component and lambda handler
- Configure the public path for js, css and image assets. The configured public path should also be referenced in the handler when adding the assets to the Hypernova response.

## Project setup

The project requires at least node version 12.

```
yarn install
```

### Compiles and hot-reloads for development

The component can be viewed in a browser in non SSR mode by running the following command.

```
yarn serve
```

You can view the component in a browser as a fully server side rendered MFE component by running the following command.

```
yarn ssr
```

### Compiles and minifies for production

```
yarn build
```

### Run your unit tests

Unit tests have not been provided in this project yet but should be provided in a _test/unit_ directory and implemented using Cypress.

```
yarn test:unit
```

### Run your end-to-end tests

E2E tests have not been provided in this project yet but should be provided in a _test/e2e_ directory and implemented using Cypress.

```
yarn test:e2e
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
