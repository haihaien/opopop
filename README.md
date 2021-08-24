# p-yu-app-framework
## native分支
> 用于调试跨平台API工程库

`uni-app` 是一个使用 `Vue.js` 开发小程序、H5、App的统一前端框架。官网地址：[https://uniapp.dcloud.io](https://uniapp.dcloud.io)

开发者使用 `Vue` 语法编写代码，`p-yu-app-framework` 框架将其编译到 小程序（微信/支付宝/百度/字节跳动/QQ/钉钉）、App（iOS/Android）、H5等多个平台，保证其正确运行并达到优秀体验。

# 私库发布地址
`yarn config set registry http://192.168.251.162:8081/repository/yx-npm-mirrors/`

`yarn config set registry http://120.133.60.64:9036/repository/yx-npm-mirrors/`
#仓库源码管理
## 1-登录仓库，输入用户名&密码
`npm login --registry=http://192.168.251.162:8081/repository/yx-npm-hosted-test/`
`npm login --registry=http://120.133.60.64:9036/repository/yx-npm-hosted-test/`
## 2-执行lerna publish
lerna publish

### 3-选择版本
选择repatch (1.0.21-alpha.0)


#资源版本管理
## 更新资源版本
yarn upgrade
## 更新yarn.lock
rimraf yarn.lock
yarn install



#框架新增路由配置项
在业务工程中pages.json新增needAuth字段，如：
```
{
    "path": "pages/ebank/main/function-all/function-all",
    "needAuth":true,//判断进入此页面是否需要登录
    "style": {
    "navigationBarTitleText": "全部功能"
    }
}
```

# 框架新增打包配置项
> 在业务工程中manifest.json配置文件中，新增app-fox配置项。如：
```
"app-fox": {
    "publicPath": "../app-fox/",
    "router": {
      "mode": "hash",
      "base": ""
    }
  },
```


# debug调式vsconsole配置项
```
  "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch via NPM",
            "runtimeExecutable": "npm",
            "runtimeArgs": [
                "run-script",
                "app-fox:debug"
            ],
            "cwd": "${workspaceFolder}",
            "env": {
                "NODE_ENV":"production",
                "UNI_WATCH":"false",
                "UNI_PLATFORM":"app-fox"
            },
            "port": 9229
        }
    ]
```

# lerna命令参数：
```
    lerna updated 
    lerna publish --skip-git 
```