import hikComp from "../components/hikComp.vue"//引入模态框组件

// 组件注册
const install = function (Vue) {
    Vue.component('hikComp', () => import("../components/hikComp.vue"))
}

export default install //这个方法以后再使用的时候可以被use调用