<template>
  <div id="app">
    <hik-comp style="width: 200px; height: 90px;" :playConfig="playConfig" v-for="item in jkInfo" :key="item.nameId" :nameId="item.nameId"
      :cameraIndexCode="item.cameraIndexCode" />
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {

      jkInfo: [
        {
          nameId: "playWnd1", // nameId 具有唯一性，否则无效
          cameraIndexCode: "xxxxxx",  // 监控点编号
        }
      ],
    };
  },
  computed: {
    /** start 海康视频WEB插件，请自行修改以下配置项 */
    playConfig: function () {
      return {
        appkey: "xxxxxxxx",                               // 【必填】 综合安防管理平台（API网关）提供的appkey
        secret: "xxxxxxxxxxxxxxxxxxxx",                   // 【必填】 综合安防管理平台（API网关）提供的secret
        ip: "xxxxxxxxxxx",                                // 【必填】 综合安防管理平台（API网关）IP地址
        playMode: 0,                                      // 初始播放模式，（决定显示预览还是回放界面）：0-预览，1-回放
        port: 443,                                        // 综合安防管理平台（API网关）端口，若启用HTTPS协议，默认443
        snapDir: "D:\\SnapDir",                           // 抓图存储路径
        videoDir: "D:\\VideoDir",                         // 紧急录像或录像剪辑存储路径
        layout: "1x1",                                    // playMode指定模式的布局
        enableHTTPS: 1,                                   // 是否启用HTTPS协议与综合安防管理平台交互，这里总是填1
        encryptedFields: 'secret',					              // 加密字段，默认加密领域为secret
        showToolbar: 0,                                   // 是否显示工具栏，0-不显示，非0-显示
        showSmart: 0,                                     // 是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
        buttonIDs: "",                                    // 自定义工具条按钮 上(具体参数见文档：p13 - p14)
        toolBarButtonIDs: "4098",                         // 自定义工具条按钮 下(具体参数见文档：p14 - p15)
      }
    }
    /** end 海康视频WEB插件，请自行修改以上配置项 */
  }
}
</script>

<style>

</style>
