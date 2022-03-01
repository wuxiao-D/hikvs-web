<template>
  <div id="app">
    <hik-comp style="width: 200px; height: 90px;" :playConfig="playConfig" v-for="item in jkInfo" :key="item.nameId" :nameId="item.nameId"
      :cameraIndexCode="item.cameraIndexCode" />

      第一部分：创建vue2项目
        看自己需要哪些，本次只使用了babel。
      第二部分：精简代码
        1、将components文件夹下的helloworld删掉，新建一个自己需要的.vue文件
        2、在App.vue中，去掉多余的内容，引入组件

      第三部分：官网账号，
        1、先到官网注册一下：https://www.npmjs.com/signup
        2、在终端中登陆：
          输入： npm login
          按提示输入Username、Password、Email
          按邮箱里的验证码输入确认一下
        3、如果使用了cnpm镜像，需要切换到官方的： npm config set registry https://registry.npmjs.org //set https origin
      第四部分：发布
         1、在项目的package.json文件中，script中添加  "install": "vue-cli-service build --target lib ./src/hikvs/index.js --name plug --dest dist-plug"
         2、终端输入： npm run install， 成功了会生产dist-plug
         3、进入到dist-plug目录下，新建package.json 和README.md
         4、输入：npm publish
         4、成功后，会收到邮件，并且到个人package中会有

git@github.com:wuxiao-D/hikvs-web.git
      
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
          cameraIndexCode: "2289a43f1c054fbd8228f9f548bb9a03",  // 监控点编号
        },
        {
          nameId: "playWnd2",
          cameraIndexCode: "ded3ef6666b04eab90d666519d1e94fd",   // 监控点编号
        },
        {
          nameId: "playWnd3",
          cameraIndexCode: "98f12d8986324f729678e82f1e17e3a9",   // 监控点编号
        },
        {
          nameId: "playWnd4",
          cameraIndexCode: "40a2053615ff459f9be79a683ed98826",   // 监控点编号
        },
        {
          nameId: "playWnd5",
          cameraIndexCode: "7f3e0ed2db144fc99b60d5ce0afccd8e",   // 监控点编号
        },
      ],
    };
  },
  computed: {
    /** start 海康视频WEB插件，请自行修改以下配置项 */
    playConfig: function () {
      return {
        appkey: "23209819",                               // 【必填】 综合安防管理平台（API网关）提供的appkey
        secret: "PxNzZ4a5qZaFxo8ymh7A",                   // 【必填】 综合安防管理平台（API网关）提供的secret
        ip: "112.2.52.61",                                // 【必填】 综合安防管理平台（API网关）IP地址
        playMode: 0,                                      // 初始播放模式，（决定显示预览还是回放界面）：0-预览，1-回放
        port: 444,                                        // 综合安防管理平台（API网关）端口，若启用HTTPS协议，默认443
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
