## Description
Simple javascript/node.js application for keeping a service/application running and up to date. Polls Amazon S3 for updates and restarts service when a new version is detected. 

## Requirements
* node.js
* npm

## Installation
```sh
npm install -g <repo-url>
```

## Usage
```sh
noderunner-js deploy/search-api/latest.zip
```

## Service requirements
These are the requirements of the services noderunner-js is to run:
* package.json file must be present at root of archive
* package.json must contain version number
* package.json must contain start script
