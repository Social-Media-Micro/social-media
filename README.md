## Monorepo Template
Welcome to the Monorepo Template! This repo contains both backend(ExpressJS) and Frontend(NextJS 14) template code. This will provide you some basic code restructure.

System Requirement
- Node Version >= 20.x.x

### General
#### Overview
We have 5 packages.
- api
- api-client
- shared-constants
- ui-core
- ui-web

#### How to setup
1. Create new repo using this template
2. Replace `monorepo` with `<YOUR_PROJECT_NAME>`
3. run
```
./bin/local-setup.sh
``` 

#### Running Locally
You can use following commands to run project
```
yarn workspace @<YOUR_PROJECT_NAME>/api start:dev   // backend
yarn workspace @<YOUR_PROJECT_NAME>/ui-web dev     // frontend
```

### Adding Dependencies
```
yarn workspace @<YOUR_PROJECT_NAME>/api add <packageName>
yarn workspace @<YOUR_PROJECT_NAME>/ui-web add <packageName>
```