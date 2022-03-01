# hikvs

## 请先到官网 https://open.hikvision.com/download/5c67f1e2f05948198c909700?type=10 下载安装 VideoWebPlugin.exe

## install
```js
npm install hikvs-web 
```

## use
```js
import hikComp from 'hikvs-web'
Vue.use(hikComp)

```
## config
* 必须给播放器容器设置宽高
* 还有以下几个参数必传项：

|参数 | 类型 |
|--|--|
| playConfig | Object |
| nameId| String |
| cameraIndexCode| String  |

* 在 computed 计算属性中, 配置playConfig属性:

|参数 | 说明 |
|--|--|
| appkey | 【必填】 综合安防管理平台（API网关）提供的appkey |
| secret| 【必填】 综合安防管理平台（API网关）提供的secret |
| ip| 【必填】 综合安防管理平台（API网关）IP地址  |
| playMode | 初始播放模式，（决定显示预览还是回放界面）：0-预览，1-回放 |
| port| 综合安防管理平台（API网关）端口，若启用HTTPS协议，默认443 |
| snapDir| 抓图存储路径  |
| videoDir | 紧急录像或录像剪辑存储路径 |
| layout| playMode指定模式的布局 |
| enableHTTPS| 是否启用HTTPS协议与综合安防管理平台交互，这里总是填1  |
| encryptedFields | 加密字段，默认加密领域为secret |
| showToolbar| 是否显示工具栏，0-不显示，非0-显示 |
| showSmart| 是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示  |
| buttonIDs| 自定义工具条按钮 上(具体参数见文档：p13 - p14) |
| toolBarButtonIDs| 自定义工具条按钮 下(具体参数见文档：p14 - p15)  |

## demo
```js
<hik-comp style="width: 200px; height: 90px;" :playConfig="playConfig"
    :nameId="jkInfo.nameId" :cameraIndexCode="jkInfo.cameraIndexCode" />



  data() {
    return {
      jkInfo: {
          nameId: "playWnd1", // nameId 具有唯一性，否则无效
          cameraIndexCode: "xxxx",  // 监控点编号
        }
    }
  },
  computed: {
    /** start 海康视频WEB插件，请自行修改以下配置项 */
    playConfig: function () {
      return {
        appkey: "",
        secret: "",
        ip: "",
        playMode: 0,
        port: 443,
        snapDir: "D:\\SnapDir",
        videoDir: "D:\\VideoDir",
        layout: "1x1",
        enableHTTPS: 1,
        encryptedFields: 'secret',
        showToolbar: 0,
        showSmart: 0,
        buttonIDs: "",
        toolBarButtonIDs: "4098",
      }
    }
    /** end 海康视频WEB插件，请自行修改以上配置项 */
  }
```

