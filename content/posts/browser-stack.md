---
title: BrowserStack
date: 2023/07/23 20:46:25
tags: [Performance, Lighthouse]
description: BrowserStack 是一個提供跨瀏覽器測試的平台，透過它可以讓我們在不同瀏覽器、不同裝置上測試我們的網站，這篇文章將介紹如何使用 BrowserStack 來進行 E2E 測試。
---

> 👉 多裝置、多瀏覽器、多版本的端點測試方案

## E2E framework 方案選擇

因為 Vue Cli 剛好有預設 Cypress 為 E2E framework ，所以選擇此方案

![](/img/content/browser-stack/case.png)

<br/>

## SetUp

**註冊 BrowserStack 帳號並取得 `username` & `access key`**

:preview-link{url="https://www.browserstack.com/accounts/settings"}

**全域安裝 BrowserStack Cypress Cli**

```bash
npm install -g browserstack-cypress-cli 
```

**資料夾結構**

```
├── test
│   ├── plugins
│   │     └── index.js             # 實際上的 cypress configuration
│   └── specs
│         └── test.js              # test case
├── ...
├── cypress.json                   # specify cypress configuration path
└── browserstack.json              # browserstack configuration
```

**準備 `browserstack.json`**

```json
{
  "auth": {
    "username": <USER_NAME>,
    "access_key": <ACCESS_KEY>
  },
  "browsers": [
    {
      "os": "Windows 10",
      "browser": "chrome",
      "versions": ["latest"]
    }
  ],
  "run_settings": {
    "cypress_config_file": "./cypress.json",
    "cypress_version": "9",
    "project_name": "BrowserStack Cypress E2E Testing",
    "build_name": "Max_Testing",
    "parallels": "10"
  },
  "disable_usage_reporting": true
}
```

:preview-link{url="https://www.browserstack.com/list-of-browsers-and-platforms/cypress_testing"}

**cypress 設定**

```bash
npm install @vue/cli-plugin-e2e-cypress
```

```json
{
  "pluginsFile": "tests/e2e/plugins/index.js"
}
```

```javascript
module.exports = (on, config) => {
  return Object.assign({}, config, {
    fixturesFolder: "tests/e2e/fixtures",
    integrationFolder: "tests/e2e/specs",
    screenshotsFolder: "tests/e2e/screenshots",
    videosFolder: "tests/e2e/videos",
    supportFile: "tests/e2e/support/index.js",

    env: {
      host: "https://insights.104.com.tw/"
    }
  });
};
```

:preview-link{url="https://docs.cypress.io/guides/references/configuration"}

<br/>

## Testing

**撰寫 test case**

```javascript
describe("My First Test", () => {
  it("Visits the app root url", () => {
    cy.visit(Cypress.env("host"));
    cy.contains("div", "協助企業建立人資管理和營運績效正循環");
  });
});
```

**run test**

```bash
browserstack-cypress run
```

:preview-link{url="https://automate.browserstack.com/dashboard/v2/builds/"}

![](/img/content/browser-stack/case.png)

<br/>

## CI / CD

雇主的情況是不擋上線流程，但透過上線流程來 trigger BrowserStack

![](/img/content/browser-stack/cicd.png)

```yaml
version: 0.2

env:
  variables:
    GITHUB_TAG_VERSION: "1.21.2094"
phases:
  install:
    runtime-versions:
      nodejs: 12
    commands:
      - npm install -g yarn
  pre_build:
    commands:
      - yarn install
      - yarn test
  build:
    commands:
      - yarn build:${ENV}
  post_build:
    commands:
      - test ${ENV} = "production" && aws s3 rm --recursive s3://${DEPLOY_BUCKET_NAME}/${GITHUB_TAG_VERSION} || echo Not Production, no need
      - test ${ENV} = "production" && aws s3 sync dist s3://${DEPLOY_BUCKET_NAME}/${GITHUB_TAG_VERSION} || echo Not Production, no need
      - aws s3 rm --recursive s3://${DEPLOY_BUCKET_NAME}/latest
      - aws s3 sync dist s3://${DEPLOY_BUCKET_NAME}/latest --region=ap-northeast-1
      - echo envType is .... ${ENV}
      - envType=${ENV}
      - |
        if [ ${envType} = "production" ]; then
          chmod +x ./browserstick.sh
          ./browserstick.sh
        elif [ ${envType} = "beta.production" ]; then
          chmod +x ./browserstick.sh
          ./browserstick.sh
        fi
```

```bash
#!/bin/bash

npm install -g browserstack-cypress-cli || echo "browserstack install failed..."
browserstack-cypress run || echo "browserstack test failed..."
```

<br/>

## Local Testing

Lab、Staging 環境想要跑測試會遇到問題，因為 BrowserStack 的機器無法進到公司內網，這時候要使用 BrowserStack 的 Local Test 功能：

![](/img/content/browser-stack/local.png)

```json
{
  "auth": {
    "username": <USER_NAME>,
    "access_key": <ACCESS_KEY>
  },
  "browsers": [
    {
      "os": "Windows 10",
      "browser": "chrome",
      "versions": ["latest"]
    }
  ],
  "run_settings": {
    "cypress_config_file": "./cypress.json",
    "cypress_version": "9",
    "project_name": "BrowserStack Cypress E2E Testing",
    "build_name": "Max_Testing",
    "parallels": "1"
  },
	"connection_settings": {
    "local": true
  },
  "disable_usage_reporting": true
}
```

```javascript
module.exports = (on, config) => {
  return Object.assign({}, config, {
    fixturesFolder: "tests/e2e/fixtures",
    integrationFolder: "tests/e2e/specs",
    screenshotsFolder: "tests/e2e/screenshots",
    videosFolder: "tests/e2e/videos",
    supportFile: "tests/e2e/support/index.js",

		pageLoadTimeout: 1000 * 90,
    env: {
      host: "https://local.employer-brand.insights.104-dev.com.tw:9527/"
    }
  });
};
```