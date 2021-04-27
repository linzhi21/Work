# pro

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

``` javascript
# IE 11 兼容方案：
npm install  --save-dev babel-polyfill
# main.js
import 'babel-polyfill';
# webpack.config.js
module.exports = {
　　entry: {
　　　　app: ["babel-polyfill", "./src/main.js"]
　　}
};
```