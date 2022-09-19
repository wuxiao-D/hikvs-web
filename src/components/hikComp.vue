<script>
import jsencrypt from '../utils/jsencrypt.min.js'
import WebControl from '../utils/jsWebControl.min.js'
export default {
  props: {
    nameId: {
      type: String,
      required: true,
      default: 'playWnd'
    },
    cameraIndexCode: {
      type: String,
      required: true
    },
    playConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      pubKey: "",           // 秘钥
      oWebControl: null,    // 播放插件的实例对象
      swfWidth: "",         // 播放器窗口宽
      swfHeight: "",        // 播放器窗口高
      initCount: 0,         // 创建实例次数，
      flag: true,           // 全屏的辅助参数
      /** start 监控点信息配置 */
      cameraConfig: {
        cameraIndexCode: this.cameraIndexCode.trim(),// 监控点编号值，必填
        streamMode: 0,      // 主子码流标识：0-主码流，1-子码流
        transMode: 1,       // 传输协议：0-UDP，1-TCP
        gpuMode: 0,         // 是否启用GPU硬解，0-不启用，1-启用
        wndId: -1,          // 播放窗口序号（在2x2以上布局下可指定播放窗口）
      }
      /** end 监控点信息配置 */
    }
  },
  render(h) {
    return h(
        'div', {
          attrs: {
            id: this.nameId
          }
        }
    )
  },
  mounted() {
    // 获取播放器宽高，便于自适应设置
    this.swfWidth = document.getElementById(this.nameId).offsetWidth;
    this.swfHeight = document.getElementById(this.nameId).offsetHeight;
    // 创建播放实例化
    this.initPlugin();
    // 监听窗口缩放resize事件，使插件窗口尺寸跟随DIV窗口变化
    window.addEventListener('resize', () => {
      this.autoOffset();
    });
    // 监听滚动条scroll事件，使插件窗口跟随浏览器滚动而移动
    window.addEventListener('scroll', () => {
      this.autoOffset();
    })
    // 4s后执行，防止加载顺序错误
    setTimeout(() => {
      this.startPreview();
    }, 4000)
  },
  methods: {
    // 创建播放实例
    initPlugin() {
      this.oWebControl = new WebControl({
        szPluginContainer: this.nameId,                       // 指定容器id
        iServicePortStart: 15900,                           // 指定起止端口号，建议使用该值
        iServicePortEnd: 15900,
        szClassId: "23BF3B0A-2C56-4D97-9C03-0CB103AA8F11",   // 用于IE10使用ActiveX的clsid
        cbConnectSuccess: () => {                     // 创建WebControl实例成功
          this.oWebControl.JS_StartService("window", {         // WebControl实例创建成功后需要启动服务
            dllPath: "./VideoPluginConnect.dll"         // 值"./VideoPluginConnect.dll"写死
          }).then(() => {                               // 启动插件服务成功
            this.oWebControl.JS_SetWindowControlCallback({   // 设置消息回调
              cbIntegrationCallBack: this.cbIntegrationCallBack
            });

            this.oWebControl.JS_CreateWnd(this.nameId, this.swfWidth, this.swfHeight).then(() => { //JS_CreateWnd创建视频播放窗口，宽高可设定
              this.init();  // 创建播放实例成功后初始化
            });
          }, function () { // 启动插件服务失败
          });
        },
        cbConnectError: () => { // 创建WebControl实例失败
          this.oWebControl = null;
          document.getElementById(this.nameId).innerText = "插件未启动，请稍候..."
          WebControl.JS_WakeUp("VideoWebPlugin://"); // 程序未启动时执行error函数，采用wakeup来唤醒程序
          this.initCount++;
          if (this.initCount < 3) {
            setTimeout(() => {
              this.initPlugin();
            }, 2000)
          } else {
            document.getElementById(this.nameId).innerText = "插件启动失败,请下载安装VideoWebPlugin.exe"
            // document.getElementById(this.nameId).innerHTML = `<button onclick="window.location.href = 'https://raw.githubusercontent.com/wuxiao-D/hikvs-web/master/public/static/VideoWebPlugin.exe'">插件启动失败,点击下载安装</button>`
          }
        },
        cbConnectClose: (bNormalClose) => {
          // 异常断开：bNormalClose = false
          // JS_Disconnect正常断开：bNormalClose = true
          console.log("cbConnectClose", bNormalClose);
          this.oWebControl = null;
        }
      });
    },
    // 设置窗口控制回调（好像没用，官方示例有，先留着）
    setCallbacks() {
      this.oWebControl.JS_SetWindowControlCallback({
        cbIntegrationCallBack: cbIntegrationCallBack
      });
    },
    // 推送消息（事件交互）
    cbIntegrationCallBack(oData) {
      if(oData.responseMsg.type == 7) {   // 如果双击
        if(this.flag) {
          this.oWebControl.JS_RequestInterface({
            funcName: "setFullScreen"   // 那么全屏
          })
        } else {
          this.oWebControl.JS_RequestInterface({
            funcName: "exitFullScreen"   // 退出全屏
          })
        }
      }
      if(oData.responseMsg.msg.result == 1024) {  // 进入全屏的状态码
        this.flag = false;
      }
      if(oData.responseMsg.msg.result == 1025) {  // 退出全屏后的状态码
        this.flag = true;
      }
    },
    // 初始化
    init() {
      this.getPubKey(() => {
        this.oWebControl.JS_RequestInterface({
          funcName: "init",
          argument: JSON.stringify({
            appkey: this.playConfig.appkey,                               // 综合安防管理平台（API网关）提供的appkey，必填
            secret: this.setEncrypt(this.playConfig.secret),  // 综合安防管理平台（API网关）提供的secret，必填
            ip: this.playConfig.ip,                                  // 综合安防管理平台（API网关）IP地址，必填
            playMode: this.playConfig.playMode,                                  // 初始播放模式，（决定显示预览还是回放界面）：0-预览，1-回放
            port: this.playConfig.port,                                  // 综合安防管理平台（API网关）端口，若启用HTTPS协议，默认443
            snapDir: this.playConfig.snapDir,                                  // 抓图存储路径
            videoDir: this.playConfig.videoDir,                                  // 紧急录像或录像剪辑存储路径
            layout: this.playConfig.layout,                                  // playMode指定模式的布局
            enableHTTPS: this.playConfig.enableHTTPS,                                  // 是否启用HTTPS协议与综合安防管理平台交互，这里总是填1
            encryptedFields: this.playConfig.encryptedFields,                                  // 加密字段，默认加密领域为secret
            showToolbar: this.playConfig.showToolbar,                                  // 是否显示工具栏，0-不显示，非0-显示
            showSmart: this.playConfig.showSmart,                                  // 是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
            buttonIDs: this.playConfig.buttonIDs,                                  // 自定义工具条按钮 上(具体参数见文档：p13 - p14)
            toolBarButtonIDs: this.playConfig.toolBarButtonIDs,                                  // 自定义工具条按钮 下(具体参数见文档：p14 - p15)
          })
        }).then((oData) => {
          this.oWebControl.JS_Resize(this.swfWidth, this.swfHeight);  // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
        });
      });
    },
    //获取公钥
    getPubKey(callback) {
      this.oWebControl.JS_RequestInterface({
        funcName: "getRSAPubKey",
        argument: JSON.stringify({
          keyLength: 1024
        })
      }).then((oData) => {
        if (oData.responseMsg.data) {
          this.pubKey = oData.responseMsg.data;
          callback()
        }
      })
    },
    // RSA加密
    setEncrypt(value) {
      var encrypt = new JSEncrypt();
      encrypt.setPublicKey(this.pubKey);
      return encrypt.encrypt(value);
    },
    // 视频预览功能 - 单个预览
    startPreview() {
      this.oWebControl.JS_RequestInterface({
        funcName: "startPreview",
        argument: JSON.stringify(this.cameraConfig)
      })
    },
    // 停止预览
    closePreview() {
      this.oWebControl.JS_RequestInterface({
        funcName: "stopAllPreview"
      });
    },
    // 设置窗口裁剪，当因滚动条滚动导致窗口需要被遮住的情况下需要JS_CuttingPartWindow部分窗口
    setWndCover() {
      let iWidth = document.documentElement.clientWidth;
      let iHeight = document.documentElement.clientHeight;
      let oDivRect = document.getElementById(this.nameId).getBoundingClientRect();
      let iCoverLeft = oDivRect.left < 0 ? Math.abs(oDivRect.left) : 0;
      let iCoverTop = oDivRect.top < 0 ? Math.abs(oDivRect.top) : 0;
      let iCoverRight = oDivRect.right - iWidth > 0 ? Math.round(oDivRect.right - iWidth) : 0;
      let iCoverBottom = oDivRect.bottom - iHeight > 0 ? Math.round(oDivRect.bottom - iHeight) : 0;
      iCoverLeft = iCoverLeft > this.swfWidth ? this.swfWidth : iCoverLeft;
      iCoverTop = iCoverTop > this.swfHeight ? this.swfHeight : iCoverTop;
      iCoverRight = iCoverRight > this.swfWidth ? this.swfWidth : iCoverRight;
      iCoverBottom = iCoverBottom > this.swfHeight ? this.swfHeight : iCoverBottom;
      this.oWebControl.JS_RepairPartWindow(0, 0, this.swfWidth + 1, this.swfHeight); // 多1个像素点防止还原后边界缺失一个像素条
      if (iCoverLeft != 0) {
        this.oWebControl.JS_CuttingPartWindow(0, 0, iCoverLeft, this.swfHeight);
      }
      if (iCoverTop != 0) {
        this.oWebControl.JS_CuttingPartWindow(0, 0, this.swfWidth + 1, iCoverTop); // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
      }
      if (iCoverRight != 0) {
        this.oWebControl.JS_CuttingPartWindow(this.swfWidth - iCoverRight, 0, iCoverRight, this.swfHeight);
      }
      if (iCoverBottom != 0) {
        this.oWebControl.JS_CuttingPartWindow(0, this.swfHeight - iCoverBottom, this.swfWidth, iCoverBottom);
      }
    },
    // 播放器窗口大小位置设置
    autoOffset() {
      if (this.oWebControl != null) {
        this.oWebControl.JS_Resize(this.swfWidth, this.swfHeight);
        this.setWndCover();
      }
    }
  },
  destroyed() {
    // 销毁播放实例
    this.oWebControl.JS_RequestInterface({
      funcName: "destroyWnd"
    });
  }
}
</script>
