# plug-demo

## Project setup
```
npm install
```

## use 
```js

// main.js
import hikComp from 'hikvs-web'
Vue.use(hikComp)

```
## config
* 必须给播放器容器设置宽高
* 还有以下几个参数必传项：

|参数 | 类型 |
|--|--|
| playConfig | Object（在computed中配置） |
| nameId| String |
| cameraIndexCode| String  |


### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

