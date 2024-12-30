<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useStore } from './store'
import { useContextMenuStore } from './store/context_menu'
import { useDialogStore } from './store/dialog'
import { useImageViewerStore } from './store/image_viewer'
import { usePhotoStore } from './store/photo'

import LoadingOverlay from './components/LoadingOverlay.vue'
import CategoryDialog from './components/CategoryDialog.vue'
import DialogOverlay from './components/DialogOverlay.vue'
import Notification from './components/Notification.vue'
import ContextMenu from './components/ContextMenu.vue'
import Navigation from './components/Navigation.vue'
import ImageViewer from './components/ImageViewer.vue'
import ScrollTop from './components/ScrollTop.vue'

const route = useRoute()
const store = {
    global: useStore(),
    ctxMenu: useContextMenuStore(),
    dialog: useDialogStore(),
    photo: usePhotoStore(),
    imageViewer: useImageViewerStore()
}

// 滚动页面时隐藏右键菜单
const handleScroll = () => {
    if (store.ctxMenu.visaible) {
        store.ctxMenu.Hide()
    }
}

const containerEl = ref<HTMLElement | null>(null)
onMounted(async () => {
    // 将容器标签绑定到全局 store（用于滚动到顶部以及其他功能）
    store.global.containerElement = containerEl.value
    // 拉取图片分类列表
    await store.photo.FetchCategories()
})
</script>

<template>
    <Navigation v-if="route.meta.showNavigation" />

    <Transition name="fadeInOut">
        <ImageViewer v-show="store.imageViewer.visible" />
    </Transition>

    <main ref="containerEl" @scroll="handleScroll">
        <RouterView />
    </main>

    <Transition name="fadeIn">
        <ContextMenu v-if="store.ctxMenu.visaible" />
    </Transition>

    <Transition name="fadeInOut">
        <DialogOverlay v-if="store.dialog.visible" />
    </Transition>

    <Transition name="fadeInOut">
        <CategoryDialog v-if="store.dialog.categoryDialogVisible" />
    </Transition>

    <Notification />

    <Transition name="fadeOut">
        <LoadingOverlay v-if="store.global.loading" />
    </Transition>

    <ScrollTop v-if="route.meta.scrollTop" />
</template>

<style lang="stylus" scoped>
main {
    padding: .5rem;
    height: calc(100vh - 3.5rem);
    box-sizing: border-box;
    overflow: auto;
    scroll-behavior: smooth;
}

// fade out

.fadeOut-enter-from,
.fadeOut-leave-to {
    opacity: 0;
}

.fadeOut-enter-to,
.fadeOut-leave-from {
    opacity: 1;
}

.fadeOut-leave-active {
    transition: opacity 0.3s;
}

// fade in

.fadeIn-enter-from {
    opacity: 0;
}

.fadeIn-enter-to {
    opacity: 1;
}

.fadeIn-enter-active {
    transition: opacity 0.3s;
}

.fadeIn-leave-from,
.fadeIn-leave-to {
    opacity: 0;
}

// fade in out

.fadeInOut-enter-from,
.fadeInOut-leave-to {
    opacity: 0;
}

.fadeInOut-enter-to,
.fadeInOut-leave-from {
    opacity: 1;
}

.fadeInOut-enter-active,
.fadeInOut-leave-active {
    transition: opacity 0.2s;
}
</style>
