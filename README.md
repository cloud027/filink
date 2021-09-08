# fiLink-web 目录结构
---
目录结构说明
---

    |-- fiLink-web
    |-- package.json
    |-- proxy.conf.json
    |-- README.md
    |-- tsconfig.json
    |-- tslint.json
    |-- src
        |-- favicon.ico
        |-- hmr.ts
        |-- index.html
        |-- karma.conf.js
        |-- main.ts
        |-- polyfills.ts
        |-- styles.scss
        |-- test.ts
        |-- theme.less
        |-- tsconfig.app.json
        |-- tsconfig.spec.json
        |-- tslint.json
        |-- app
        |   |-- app-routing.module.ts
        |   |-- app.component.html
        |   |-- app.component.scss
        |   |-- app.component.spec.ts
        |   |-- app.component.ts
        |   |-- app.module.ts
        |   |-- business-module
        |   |   |-- business-websocket-msg.service.ts
        |   |   |-- business.component.html
        |   |   |-- business.component.scss
        |   |   |-- business.component.spec.ts
        |   |   |-- business.component.ts
        |   |   |-- business.module.ts
        |   |   |-- business.routes.ts
        |   |   |-- alarm
        |   |   |-- application-system
        |   |   |-- big-screen
        |   |   |-- download
        |   |   |-- facility
        |   |   |   |-- area-manage
        |   |   |   |-- facility-manage
        |   |   |   |-- model                                           // 业务模型
        |   |   |   |   |-- base-info.model.ts
        |   |   |   |   |-- box-info.model.ts
        |   |   |   |   |-- control.model.ts
        |   |   |   |   |-- facility-detail-form.model.ts
        |   |   |   |   |-- facility-list.model.ts
        |   |   |   |   |-- facility-view-detail.model.ts
        |   |   |   |   |-- const
        |   |   |   |       |-- core-end.config.ts
        |   |   |   |       |-- facility.config.ts
        |   |   |   |       |-- smart-label.config.ts
        |   |   |   |-- service                                         // 业务服务
        |   |   |       |-- facility-api.service.ts
        |   |   |       |-- facility-util.service.ts
        |   |   |       |-- facility-api.interface.ts
        |   |   |-- index
        |   |   |-- login
        |   |   |-- menu
        |   |   |-- notfound
        |   |   |-- statistical-report
        |   |   |-- system-setting
        |   |   |-- user
        |   |   |-- work-order
        |   |-- core-module
        |   |   |-- basic-auth.ts
        |   |   |-- core-module.module.ts
        |   |   |-- api-service                                        // 公共业务服务
        |   |   |   |-- api-common.config.ts
        |   |   |   |-- index.ts
        |   |   |   |-- alarm
        |   |   |   |-- download
        |   |   |   |-- facility
        |   |   |   |-- index
        |   |   |   |-- lock
        |   |   |   |-- login
        |   |   |   |-- screen-map
        |   |   |   |-- statistical
        |   |   |   |-- system-setting
        |   |   |   |-- user
        |   |   |   |-- work-order
        |   |   |-- guard-service
        |   |   |-- interceptor
        |   |   |-- mission
        |   |   |-- model                                               // 公共业务模型
        |   |   |   |-- result.model.ts
        |   |   |   |-- facility
        |   |   |   |   |-- area.model.ts
        |   |   |   |   |-- facility-log.ts
        |   |   |   |   |-- facility-port-info.ts
        |   |   |   |   |-- facility.ts
        |   |   |   |   |-- template.model.ts
        |   |   |   |-- work-order
        |   |   |-- store
        |   |   |-- websocket
        |   |-- shared-module
        |   |   |-- shared-module.module.ts
        |   |   |-- animations
        |   |   |-- component                                           // 公共组件
        |   |   |   |-- alarm
        |   |   |   |-- audio
        |   |   |   |-- breadcrumb
        |   |   |   |-- business-component                              // 业务组件
        |   |   |   |-- map
        |   |   |   |-- select
        |   |   |   |-- selector
        |   |   |   |-- statistical-slider
        |   |   |   |-- table
        |   |   |-- const
        |   |   |-- directive
        |   |   |-- entity
        |   |   |-- enum
        |   |   |-- pipe
        |   |   |-- service
        |   |   |-- util
        |   |-- style-module
        |-- assets
        |-- environments
---

### 代码风格 
- 严格按照tslint规范编程
- 每次提交代码之前记得运行npm run lint 并修改错误
- 代码规范严格遵守《前端开发流程&代码规范.doc》

### 注释规范
- component中的每个属性都要有行内注释说明
- 每个方法都要有文档注释，尽量说明功能、参数、返回值
- 多分支判断，以及关键逻辑要注释清除
- 特殊的样式覆盖要注释清除

###  安装依赖
npm install

###  运行项目

- 修改代理配置文件 proxy.conf.json
- npm run start
- localhost:4200

###  打包项目
npm run build
