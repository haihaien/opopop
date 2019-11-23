# p-yu-app-framework

`uni-app` 是一个使用 `Vue.js` 开发小程序、H5、App的统一前端框架。官网地址：[https://uniapp.dcloud.io](https://uniapp.dcloud.io)

开发者使用 `Vue` 语法编写代码，`p-yu-app-framework` 框架将其编译到 小程序（微信/支付宝/百度/字节跳动/QQ/钉钉）、App（iOS/Android）、H5等多个平台，保证其正确运行并达到优秀体验。

# 私库发布地址
yarn config set registry http://192.168.251.162:8081/repository/yx-npm-hosted-test/

#仓库源码管理
## 1-登录仓库，输入用户名&密码
npm login --registry=http://192.168.251.162:8081/repository/yx-npm-hosted-test/
## 2-执行lerna publish
lerna publish