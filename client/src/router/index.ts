import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '../store/user'
import Home from '../views/Home.vue'

declare module 'vue-router' {
    interface RouteMeta {
        requireLogin: boolean
        showNavigation: boolean
        scrollTop: boolean
        pages: boolean
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Home,
        meta: {
            requireLogin: true,
            showNavigation: true,
            scrollTop: true,
            pages: true
        }
    },
    {
        path: '/views/categories',
        component: () => import('../views/Categories.vue'),
        meta: {
            requireLogin: true,
            showNavigation: true,
            scrollTop: false,
            pages: false
        }
    },
    {
        path: '/views/user-management',
        component: () => import('../views/UserManager.vue'),
        meta: {
            requireLogin: true,
            showNavigation: true,
            scrollTop: false,
            pages: false
        }
    },
    {
        path: '/views/404',
        component: () => import('../views/NotFound.vue'),
        meta: {
            requireLogin: false,
            showNavigation: false,
            scrollTop: false,
            pages: false
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, _, next) => {
    const matched = router.getRoutes().some((route) => route.path === to.path)
    if (!matched) {
        next('/views/404')
        return
    }

    if (to.meta.requireLogin === false) {
        return
    }

    const userStore = useUserStore()
    while (!(await userStore.IsLogin())) {
        const email = prompt('请输入邮箱')
        if (!email) {
            alert('邮箱不能为空')
            continue
        }

        const password = prompt('请输入密码')
        if (!password) {
            alert('密码不能为空')
            continue
        }

        if (!(await userStore.Login(email, password))) {
            alert('登录失败，请检查邮箱和密码')
            continue
        }

        location.reload()
    }

    next()
})

export { router }
