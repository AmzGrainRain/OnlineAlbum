<script lang="ts" setup>
import { ref, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useStore } from '../store'
import { useContextMenuStore } from '../store/context_menu'
import { usePhotoStore } from '../store/photo'

import { ListPhoto } from '../api/photo/list'

import PhotoCard from '../components/PhotoCard.vue'

const route = useRoute()
const store = {
    global: useStore(),
    photo: usePhotoStore(),
    ctxMenu: useContextMenuStore()
}
store.global.$Init()

const rootEl = ref<HTMLDivElement | null>(null)

/**
 * 获取数据
 */
const fetchData = async () => {
    // 显示加载动画
    store.global.SetLoading(true)

    // 清空已有数据
    store.photo.photos.length = 0

    // 默认分类
    let category = 0

    // 尝试从路由参数中获取分类
    if (route.query?.category) {
        const num = parseInt(route.query.category as string)
        category = isNaN(num) ? 0 : num
        store.global.currentCategory = category
    }

    // 跟去当前的页码、每页数量、分类请求数据
    const resp = await ListPhoto(store.global.page.current, store.global.page.limit, category)
    store.photo.photos = resp.data.photos
    store.global.UpdateTotal(resp.data.total)

    // 获取到了新的数据后应当滚动到顶部
    if (rootEl.value) {
        await nextTick()
        rootEl.value.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // 隐藏加载动画
    store.global.SetLoading(false)
}
fetchData()

// 页码变化时应当重新请求数据
watch(() => store.global.page.current, fetchData)
</script>

<template>
    <div id="home" ref="rootEl">
        <PhotoCard v-for="photo in store.photo.photos" :key="photo.id" :photo="photo" />
    </div>
</template>

<style scoped lang="stylus">
#home {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    gap: .5rem;
    scroll-behavior: smooth;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>
