import { createApp, toRaw } from 'vue'
import { router } from './router'
import App from './App.vue'
import { createPinia, PiniaPluginContext } from 'pinia'

import './style.css'
import 'boxicons/css/boxicons.min.css'

const store = createPinia()
const piniaPlugin = () => (ctx: PiniaPluginContext) => {
    const { store } = ctx
    const key = `${store.$id}`
    if (key !== 'user') {
        return
    }

    const data = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) as string) : {}
    store.$subscribe(() => {
        localStorage.setItem(key, JSON.stringify(toRaw(store.$state)))
    })
    return { ...data }
}
store.use(piniaPlugin())

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('body')
