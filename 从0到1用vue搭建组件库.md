#  打造自己的 Vue 组件库 

### **1、初始化 npm**

项目文件夹内执行 `npm init -y`，执行成功目录结构如下：

```
project ----------- // 项目文件夹名称
└─package.json ---- // npm 配置文件  
```

### **2、初始化目录结构**

创建三个文件夹，分别是 `build`、`packages`、`styles`，和一个 `index.js` 文件。

```
project ----------- // 项目文件夹名称
├─build ----------- // webpack 配置文件夹
├─index.js -------- // 入口文件
├─package.json ---- // npm 配置文件 
├─packages -------- // 组件文件夹
└─styles ---------- // 组件样式文件夹
```

### **3、配置公共 `webpack` 配置**

在 `build` 文件夹内新建一个 `webpack.base.js` 文件。

```
project ---------------- // 项目文件夹名称
├─build ---------------- // webpack 配置文件夹
│ └─webpack.base.js ---- // webpack 公共配置
├─index.js ------------- // 入口文件
├─package.json --------- // npm 配置文件  
├─packages ------------- // 组件文件夹
└─styles --------------- // 组件样式文件夹
```

写入如下配置：

```javascript
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loaders: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          }
        ],
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader?limit=8192'
      },
    ],
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new VueLoaderPlugin(),
  ],
}
```

以上配置就都只是一些常用的 `loader` ，和使用了一个 `webpack` 的优化打包的插件 `new webpack.optimize.ModuleConcatenationPlugin()` ，一下是官方解释的这个插件用途。

> 过去 webpack 打包时的一个取舍是将 bundle 中各个模块单独打包成闭包。这些打包函数使你的 JavaScript 在浏览器中处理的更慢。相比之下，一些工具像 Closure Compiler 和 RollupJS 可以提升(hoist)或者预编译所有模块到一个闭包中，提升你的代码在浏览器中的执行速度。

以上配置需要安装以下 `npm` 包：

```bash
npm i -D webpack webpack-cli vue-loader vue-template-compiler babel-loader @babel/core @babel/preset-env style-loader css-loader url-loader
```

因为装有 `babel-loader` ，得创建一个 `.babelrc` 的配置文件。

```
project ---------------- // 项目文件夹名称
├─.babelrc ------------- // babel 配置文件
├─build ---------------- // webpack 配置文件夹
│ └─webpack.base.js ---- // webpack 公共配置
├─index.js ------------- // 入口文件
├─package-lock.json ---- // package.json 安装的包的快照
├─package.json --------- // npm 配置文件
├─packages ------------- // 组件文件夹
└─styles --------------- // 组件样式文件夹
```

并写入如下配置：

```json
{
  "presets": [
    "@babel/preset-env"
  ]
}
```

### **4、编写两个简陋的组件**

- 创建一个 `button` 组件和一个 `link` 组件。

- 目录结构如下：

  ```
  project ---------------- // 项目文件夹名称
  ├─.babelrc ------------- // babel 配置文件
  ├─build ---------------- // webpack 配置文件夹
  │ └─webpack.base.js ---- // webpack 公共配置
  ├─index.js ------------- // 入口文件
  ├─package-lock.json ---- // package.json 安装的包的快照
  ├─package.json --------- // npm 配置文件
  ├─packages ------------- // 组件文件夹
  │ ├─button ------------- // button 组件
  │ │ ├─index.js 
  │ │ └─src 
  │ │   └─main.vue 
  │ └─link --------------- // link 组件
  │   ├─index.js 
  │   └─src 
  │     └─main.vue 
  └─styles --------------- // 组件样式文件夹
  ```

- 组件的的目录结构借鉴了 `element-ui` ，方便 `webpack` 打包成按需加载的结构。

- `button` 代码如下：

  ```javascript
  // packages/button/src/main.vue
  <template>
    <button class="my-button">Click</button>
  </template>
  
  <script>
  export default {
    name: 'MyButton',
  }
  </script>
  ```

  ```javascript
  // packages/button/index.js
  import Button from './src/main.vue';
  
  Button.install = function (Vue) {
    Vue.component(Button.name, Button);
  };
  
  export default Button;
  ```

- `link` 代码如下：

  ```javascript
  // packages/link/src/main.vue
  <template>
    <a class="my-link">Link</a>
  </template>
  
  <script>
  export default {
    name: 'MyLink',
  }
  </script>
  ```

  ```javascript
  // package/link/index.js
  import Link from './src/main.vue';
  
  Link.install = function (Vue) {
    Vue.component(Link.name, Link);
  };
  
  export default Link;
  ```

- 每个组件都要有 `name` 属性。

- 样式并没有写在 `vue` 文件内部，全部都单独写到了 `styles` 文件夹内。

- `button` 样式：

  ```css
  // styles/button.less
  .my-button {
    background: yellowgreen;
  }
  ```

- `link` 样式：

  ```css
  // styles/link.less
  .my-link {
    color: blueviolet;
  }
  ```

- 入口文件 `index.js` 编写：

  ```javascript
  // index.js
  import Button from './packages/button/index.js';
  import Link from './packages/link/index.js';
  
  const components = [
    Button,
    Link,
  ];
  
  const install = function (Vue, opt = {}) {
    components.forEach(component => {
      Vue.component(component.name, component);
    });
  };
  
  if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }
  
  export default {
    install,
    Button,
    Link,
  };
  ```

  引入写好的组件，每个组件添加相应的 `install` 方法，这样注册组件的时候就可以使用 `Vue.use()` 进行注册。

### **5、配置完全引入 webpack 打包配置**

目录结构：

```
project ---------------- // 项目文件夹名称
├─.babelrc ------------- // babel 配置文件
├─build ---------------- // webpack 配置文件夹
│ ├─webpack.base.js ---- // webpack 公共配置
│ └─webpack.prod.js ---- // 全量打包 webpack 配置
├─index.js ------------- // 入口文件
├─lib 
│ └─index.js 
├─package-lock.json ---- // package.json 安装的包的快照
├─package.json --------- // npm 配置文件
├─packages ------------- // 组件文件夹
│ ├─button ------------- // button 组件
│ │ ├─index.js 
│ │ └─src 
│ │   └─main.vue 
│ └─link --------------- // link 组件
│   ├─index.js 
│   └─src 
│     └─main.vue 
└─styles --------------- // 组件样式文件夹
  ├─button.less 
  └─link.less 
// build/webpack.prod.js
const path = require('path');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.js');

module.exports = merge(webpackBaseConfig, {
  mode: "production",
  entry: {
    main: path.resolve(__dirname, '../index.js'),
  },
  output: {
    path: path.resolve(__dirname, '../lib'),
    publicPath: '/lib/',
    filename: 'index.js',
    library: 'my-library',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    }
  },
});
```

这里用到了 `webpack-merge` 这个工具，需要 `npm` 安装，这个工具主要以追加的形式合并 `webpack` 配置。

```bash
npm i -D webpack-merge
```

以上配置大概就是合并了 `webpack.base.js` 里的 `loader` 配置，设置了入口文件，输出文件路径，并以 `umd` 的模式进行打包，把 `vue` 设置成外部依赖，不需要打包进输出文件内。

再配置一下 `package.json` 的 `script` ，添加一条打包命令。

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build:prod": "webpack --config build/webpack.prod.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.10.2",
    "@babel/preset-env": "^7.10.2",
    "babel-loader": "^8.1.0",
    "css-loader": "^3.5.3",
    "style-loader": "^1.2.1",
    "url-loader": "^4.1.0",
    "vue-loader": "^15.9.2",
    "vue-template-compiler": "^2.6.11",
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.11",
    "webpack-merge": "^4.2.2"
  }
}
```

控制台执行 `npm run build:prod` 即可打包完成，打包完成后多出了一个 `lib` 文件夹，文件夹下有个 `index.js` 文件，这个文件就是全量组件的 `js` 文件。

> 每次打包完成后，记得先删除旧的 `lib` 文件，这样好对比，有一个 `webpack` 插件可以帮忙做到每次打包的时候删除旧的打包文件，此处为了简洁，就不使用了。

### **6、组件的样式文件打包**

组件的的逻辑代码已经完成，但是样式却没有，样式需要借助 `gulp` 进行打包处理，`gulp` 打包 `css` 比 `webpack` 的方便一些，所以选择了 `gulp` 。

在 `build` 文件夹下新建一个 `gen-style.js` 文件。

```
project ---------------- // 项目文件夹名称
├─.babelrc ------------- // babel 配置文件
├─build ---------------- // webpack 配置文件夹
│ ├─gen-style.js ------- // gulp 打包样式配置
│ ├─webpack.base.js ---- // webpack 公共配置
│ └─webpack.prod.js ---- // 全量打包 webpack 配置
├─index.js ------------- // 入口文件
├─lib 
│ └─index.js 
├─package-lock.json ---- // package.json 安装的包的快照
├─package.json --------- // npm 配置文件
├─packages ------------- // 组件文件夹
│ ├─button ------------- // button 组件
│ │ ├─index.js 
│ │ └─src 
│ │   └─main.vue 
│ └─link --------------- // link 组件
│   ├─index.js 
│   └─src 
│     └─main.vue 
└─styles --------------- // 组件样式文件夹
  ├─button.less 
  └─link.less 
```

写下如下代码：

```javascript
// build/gen-style.js
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const less = require('gulp-less');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

function buildCss(cb) {
  gulp.src('../styles/index.less')
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename('index.css'))
    .pipe(gulp.dest('../lib/styles'));
  cb()
}

exports.default = gulp.series(buildCss);
```

需要安装一下几个包，不喜欢用 `less` 的话，可以把 `gulp-less` 替换成自己想用的预处理器。

```bash
npm i -D gulp gulp-clean-css gulp-less gulp-rename gulp-autoprefixer
```

`gen-style.js` 文件中，有一个 `buildCss` 方法，这个方法就是把 `styles/index.less` 文件，打包成一个预处理好之后的 `index.css` 文件。`gule` 配置好，但是我们 `styles` 并没有 `index.less` 文件，先创建他并写入一些代码。

```less
// styles/index.less
@import './button.less';
@import './link.less';
```

全量加载组件的时候，就会用到这个 `index.less` 的样式。

```
project ---------------- // 项目文件夹名称
├─.babelrc ------------- // babel 配置文件
├─build ---------------- // webpack 配置文件夹
│ ├─gen-style.js ------- // gulp 打包样式配置
│ ├─webpack.base.js ---- // webpack 公共配置
│ └─webpack.prod.js 
├─index.js ------------- // 入口文件
├─package-lock.json ---- // package.json 安装的包的快照
├─package.json --------- // npm 配置文件
├─packages ------------- // 组件文件夹
│ ├─button ------------- // button 组件
│ │ ├─index.js 
│ │ └─src 
│ │   └─main.vue 
│ └─link --------------- // link 组件
│   ├─index.js 
│   └─src 
│     └─main.vue 
└─styles --------------- // 组件样式文件夹
  ├─button.less 
  ├─index.less --------- // 全量加载使用时的样式
  └─link.less 
```

`package.json` 文件添加打包样式的命令。

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build:style": "gulp --gulpfile build/gen-style.js",
    "build:prod": "webpack --config build/webpack.prod.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.10.2",
    "@babel/preset-env": "^7.10.2",
    "babel-loader": "^8.1.0",
    "css-loader": "^3.5.3",
    "gulp": "^4.0.2",
    "gulp-autoprefixer": "^7.0.1",
    "gulp-clean-css": "^4.3.0",
    "gulp-less": "^4.0.1",
    "gulp-rename": "^2.0.0",
    "style-loader": "^1.2.1",
    "url-loader": "^4.1.0",
    "vue-loader": "^15.9.2",
    "vue-template-compiler": "^2.6.11",
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.11",
    "webpack-merge": "^4.2.2"
  }
}
```

使用 `npm run build:style` 命令试一下样式打包，正常打包。

### **7、按需加载打包（组件逻辑/样式打包）**

全量加载完成了，接下来就是按需加载的打包配置了，先配置组件逻辑部分的打包，也是用到的 `webpack` 进行打包。

在 `build` 文件夹下新建一个 `webpack.component.js` 文件和 `components.json` 文件，`components.json` 文件是用来记录组件的路径。

```
project --------------------- // 项目文件夹名称
├─.babelrc ------------------ // babel 配置文件
├─build --------------------- // webpack 配置文件夹
│ ├─components.json --------- // 组件路径文件
│ ├─gen-style.js ------------ // gulp 打包样式配置
│ ├─webpack.base.js --------- // webpack 公共配置
│ ├─webpack.component.js ---- // 按需加载打包配置
│ └─webpack.prod.js 
├─index.js ------------------ // 入口文件
├─package-lock.json --------- // package.json 安装的包的快照
├─package.json -------------- // npm 配置文件
├─packages ------------------ // 组件文件夹
│ ├─button ------------------ // button 组件
│ │ ├─index.js 
│ │ └─src 
│ │   └─main.vue 
│ └─link -------------------- // link 组件
│   ├─index.js 
│   └─src 
│     └─main.vue 
└─styles -------------------- // 组件样式文件夹
  ├─button.less 
  ├─index.less -------------- // 全量加载使用时的样式
  └─link.less 
// build/components.json
{
  "button": "packages/button/index.js",
  "link": "packages/link/index.js"
}
// build/webpack.component.js
const path = require('path');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.js');
const components = require('./components.json');

const basePath = path.resolve(__dirname, '../');

let entries = {};

Object.keys(components).forEach(key => {
  entries[key] = path.join(basePath, components[key]);
});

module.exports = merge(webpackBaseConfig, {
  mode: "production",
  entry: entries,
  output: {
    path: path.resolve(__dirname, '../lib'),
    publicPath: '/lib/',
    filename: '[name].js',
    chunkFilename: '[id].js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    }
  },
});
```

`webpack.component.js` 配置，合并了基础的配置，然后遍历 `components.json` 的组件路径，创建一个多入口文件的 `webpack` 配置，然后使用 `umd` 的打包方式把每个组件打包成一个 `js` 文件，跟 `webpack.prod.js` 一样，打包的时候不加入 `vue` 这个库。

`package.json` 添加打包按需加载的命令。

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build:style": "gulp --gulpfile build/gen-style.js",
    "build:component": "webpack --config build/webpack.component.js",
    "build:prod": "webpack --config build/webpack.prod.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.10.2",
    "@babel/preset-env": "^7.10.2",
    "babel-loader": "^8.1.0",
    "css-loader": "^3.5.3",
    "gulp": "^4.0.2",
    "gulp-autoprefixer": "^7.0.1",
    "gulp-clean-css": "^4.3.0",
    "gulp-less": "^4.0.1",
    "gulp-rename": "^2.0.0",
    "style-loader": "^1.2.1",
    "url-loader": "^4.1.0",
    "vue-loader": "^15.9.2",
    "vue-template-compiler": "^2.6.11",
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.11",
    "webpack-merge": "^4.2.2"
  }
}
```

执行 `npm run build:component` 测试打包，打包正常。

打包按需加载样式，只需要在 `gen-style.js` 文件内引入 `components.json` 文件和加一个新的处理方法即可。

```javascript
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const less = require('gulp-less');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const components = require('./components.json');

function buildCss(cb) {
  gulp.src('../styles/index.less')
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename('index.css'))
    .pipe(gulp.dest('../lib/styles'));
  cb()
}

function buildSeperateCss(cb) {
  Object.keys(components).forEach(compName => {
    gulp.src(`../styles/${compName}.less`)
      .pipe(less())
      .pipe(autoprefixer())
      .pipe(cleanCSS())
      .pipe(rename(`${compName}.css`))
      .pipe(gulp.dest('../lib/styles'));
  })

  cb()
}

exports.default = gulp.series(buildCss, buildSeperateCss);
```

执行一下 `npm run build:style` 测试打包，打包成功。

到这，全部打包配置已完成，可以开始自己的组件库编写之旅了。最后，添加一条一次完成所有命令的命令，只要执行一条命令，就可以把全部打包完成。

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build:style": "gulp --gulpfile build/gen-style.js",
    "build:component": "webpack --config build/webpack.component.js",
    "build:prod": "webpack --config build/webpack.prod.js",
    "lib": "npm run build:prod && npm run build:component && npm run build:style"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.10.2",
    "@babel/preset-env": "^7.10.2",
    "babel-loader": "^8.1.0",
    "css-loader": "^3.5.3",
    "gulp": "^4.0.2",
    "gulp-autoprefixer": "^7.0.1",
    "gulp-clean-css": "^4.3.0",
    "gulp-less": "^4.0.1",
    "gulp-rename": "^2.0.0",
    "style-loader": "^1.2.1",
    "url-loader": "^4.1.0",
    "vue-loader": "^15.9.2",
    "vue-template-compiler": "^2.6.11",
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.11",
    "webpack-merge": "^4.2.2"
  }
}
```

执行 `npm run lib` 即可全部打包完成。

### **8、npm 包的发布**

发布包我只介绍一下 `package.json` 哪些配置是必须的，具体发布步骤见下文。

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "description": "",
  "main": "lib/index.js",
  "files": [
    "lib"
  ],
  "scripts": {
    "build:style": "gulp --gulpfile build/gen-style.js",
    "build:component": "webpack --config build/webpack.component.js",
    "build:prod": "webpack --config build/webpack.prod.js",
    "lib": "npm run build:prod && npm run build:component && npm run build:style"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.10.2",
    "@babel/preset-env": "^7.10.2",
    "babel-loader": "^8.1.0",
    "css-loader": "^3.5.3",
    "gulp": "^4.0.2",
    "gulp-autoprefixer": "^7.0.1",
    "gulp-clean-css": "^4.3.0",
    "gulp-less": "^4.0.1",
    "gulp-rename": "^2.0.0",
    "style-loader": "^1.2.1",
    "url-loader": "^4.1.0",
    "vue-loader": "^15.9.2",
    "vue-template-compiler": "^2.6.11",
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.11",
    "webpack-merge": "^4.2.2"
  }
}
```

- `name` 是包的名字，如果这个名字已经跟 `npm` 上的重复了，就自己改一下，不然是发布不了的。
- `version` 每次发布都需要修改一下版本号才能发布。
- `main` 入口设置成 `lib/index.js` 路径，也可以根据你打包的名字自己修改。
- `files` 设置上传到 `npm` 的文件或文件夹，一定要把打包好的 `lib` 文件上传，其他随意。

以上四个是必须要注意的，其他自己搜索看看有什么效果看着改。

### **9、使用组件库**

1. 安装自己的组件库

   ```bash
   npm i [name]
   ```

2. 全量引入

   ```javascript
   import MyUI from 'MyUI';
   import "MyUI/lib/styles/index.css";
   
   Vue.use(MyUI);
   ```

   `MyUI` 是发布 `npm` 包的名字。

3. 按需引入

   先安装 `babel-plugin-component`：

   ```bash
   npm install -D babel-plugin-component
   ```

   配置 `.babelrc` 文件

   ```
   {
     "presets": [
       [
         "@babel/preset-env",
         {
           "modules": false
         }
       ]
     ],
     "plugins": [
       [
         "component",
         {
           "libraryName": "MyUI",
           "libDir": "lib",
           "styleLibrary": {
             "name": "styles",
             "base": false,
             "path": "[module].css"
           }
         }
       ]
     ]
   }
   ```

   如果你打包的目录结构跟我这个是一样的话，秩序修改 `libraryName` 即可。

   使用组件：

   ```javascript
   import { Button, Link } from 'MyUI';
   
   Vue.use(Button);
   Vue.use(Link);
   ```

### 10、怎么把`npm`发布出去

 1、运行`npm publish` 

一般第一次会提示出错，此时需要先登录。

2、 `npm login`，然后输入Username，Password，Email 

3、如果换过淘宝镜像也可能会出错，此时需要换回镜像。

```
npm config set registry=http://registry.npmjs.org
```

4、库发布成功了在设置回去

```
npm config set registry=https://registry.npm.taobao.org/
```

