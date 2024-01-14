// 路由鉴权：鉴权是指项目当中的路由能不能被访问的权限的设置（某一个路由什么条件下可以访问、什么条件下不能访问）。
/*
// import {useRouter} from "vue-router"; // .vue文件中获取路由器router的方式，该方式无法在.js/.ts中使用，会获取到undefined
// let router = useRouter(); // 路由器对象
 */
import router from "@/router"; // .js/.ts/.vue中获取路由器对象router的方式
/*
这里需要先引入大仓库pinia，使用useUserStore时入参即可，否则会报错：
"getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
 */
import pinia from "@/store";
import setting from "@/setting";

// 获取用户相关的小仓库内部token数据，去判断用户是否登录成功
import useUserStore from "@/store/modules/user";

import * as nprogress from 'nprogress'
import "nprogress/nprogress.css"

// 去掉加载进度条（右侧加载圆圈）
nprogress.configure({showSpinner: false});

let userStore = useUserStore(pinia);

// 全局前置守卫
/**
 * to - 将要访问的路由
 * from - 从哪一个路由而来
 * next - 路由的放行函数，next()-放行 next(path)-放行到指定路由 next(false)-中断当前的导航
 */
router.beforeEach(async (to, from, next) => {
    nprogress.start();
    // 获取token，去判断用户登录、还是未登录
    let token = userStore.token;
    // 获取用户名字
    let username = userStore.username;
    // 用户登录判断
    if (token) {
        // 登录成功，访问login，不能访问，指向首页
        if (to.path == '/login') {
            next({path: from.path})
        }
        // 登录成功后，访问其余路由（登录排除）
        else {
            if (username) {
                next();
            } else {
                try {
                    // 获取用户信息
                    await userStore.userInfo();
                    next();
                } catch (e) {
                    // token已过期或被篡改：获取不到用户信息了
                    console.error("token已过期或被篡改，获取用户信息失败:", e);
                    const result = confirm("token已过期，重新获取！");
                    if (result) {
                        try {
                            await userStore.userLogout()
                            next({path: '/login', query: {redirect: to.path}})
                        } catch (error) {
                            console.error("退出登录失败:", error.message);
                        }
                    }
                }
            }
        }
    } else {
        if (to.path == '/login') {
            next();
        } else {
            next({path: '/login', query: {redirect: to.path}})
        }
    }
})

// 全局后置守卫
router.afterEach((to, from, failure) => {
    document.title = `${setting.title}-${to.meta.title}`;
    nprogress.done();
})