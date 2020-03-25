# ai-app-vue-toss

### [Graphql测试](http://47.98.38.59:43401/)

### [测试环境](https://msb-ai.meixiu.mobi/frontend/ai-app-vue-toss/student-team/#/)

### [正式环境](https://toss.xiaoxiongmeishu.com/student-team/#/)

### [Search API](http://docker.meixiu.mobi:48767/jsondoc-ui.html?url=/data/search/m1/jsondoc#)


---

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Lints and fixes files
```
yarn lint
```

## 文件命名规范

- js 文件名小驼峰，使用 ES6 及以上语法，class 类名大驼峰，变量名、函数小驼峰
- css 文件名全小写，选择器命名使用中划线，例：.nav-page
- components 目录下的公共组件使用大驼峰，即所有单词首字母大写
- 目录名，页面组件使用小驼峰，vue 组件标签使用中划线

## Git 规范及上线流程

- 分支命名：feature/功能名 feature/版本号 stage/版本号 hotfix/BUG 名称
- commit 描述：**type必写**：（见/commitlint.config.js）

```text
增加功能时使用  -> feat：功能项描述
修复问题时使用  -> fix： 修复的问题描述
单纯修改样式文件-> style：样式描述
合并分支       -> merge：合并分支描述
修改文档       -> docs： 文档描述
修改配置文件时  -> config：修改的内容描述
```

- feature 分支在开发需求时使用，尽量分的细一点，方便 Code Review
- 功能需求开发完毕，将 feature/功能名 合并到 feature/版本号 之后开发人员进行自测，自测通过后提交到测试环境交由测试进行冒烟测试
- 测试过程中出现了 bug，在 feature/功能名 修复 bug 后合并到 feature/版本号 自测通过后提交到测试环境由测试进行验证
- 冒烟测试通过后，将 feature/版本号 合并到 stage/版本号 提交到预发布环境进行测试
- 预发布测试没问题，将 master 打 Tags，发起合并请求 stage/版本号 合并至 master 进行上线
- 上线后如果出现 bug，紧急严重无法短时间修复的执行回滚 Tags，如果不是紧急不严重的 bug，从 stage/版本号 创建 hotfix/bug 名称 进行 bug 修复，修复完成后合并至 stage/版本号 进行二次上线，测试进行回归测试
- 上线后定期清理无用的历史分支


## 项目设计

#### 业务模块
单个业务模块在`src/pages/`的文件夹下。如课程、班级、老师等功能模块划分是单独的一个文件夹，命名方式 `小骆峰`: `studentTeam`
每个模块的路由、页面、组件正常组织。 

新建模块是，对应完善`src/utils/menuItems.js`文件, 对应模块名称,link属性值为`中线`连接: `student-team` 。 TODO: 待完善。

**【参考 `src/pages/dashboard`**】
```
|-- moudleName
    |-- components   // 模块内公共组件
    |-- views        // 业务页面
    |-- module       // 业务模块的接口请求
    |-- main.js      // 模块入口文件
    |-- router.js    // 模块路由
    |-- nav.js       // 左侧导航菜单
```

#### UI组件
- `src/components`下是全局组件，各个模块共用，请谨慎修改
- `src/pages/moduleName/components`下是各个模块的公用组件

#### 布局文件
`src/components/Layout/` 布局组件
- 左侧菜单给 `AppLayout`组件传`props`-navItems。 参考 `src/pages/dashboard`


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### docs
- [element-ui](https://element.eleme.cn/#/zh-CN/component/quickstart)
- [sass](https://www.sass.hk/docs/)
