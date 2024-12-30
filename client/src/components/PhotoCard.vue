<script setup lang="ts">
import { ref, watch } from 'vue'

import { usePhotoStore } from '../store/photo'
import { useContextMenuStore } from '../store/context_menu'
import { useImageViewerStore } from '../store/image_viewer'
import { useUserStore } from '../store/user'

import { PhotoT } from '../model'

const props = defineProps<{ photo: PhotoT }>()
const store = {
    photo: usePhotoStore(),
    user: useUserStore(),
    ctxMenu: useContextMenuStore(),
    imageViewer: useImageViewerStore()
}

// 图片是否处于正在加载的状态
const loading = ref(true)

// 图片是否处于被选中的状态
const selected = ref<boolean>(false)

// 监听当前图片的选择状态
watch(selected, (nv) => {
    // 如果没有启用多选，则不进行任何操作
    if (!store.photo.selection.enabled) {
        return
    }
    // 如果启用多选，则根据当前的选择状态，从被选择的图片列表中添加或移除当前图片
    nv ?
        store.photo.AddToSelected([props.photo]) :
        store.photo.RemoveSelected([props.photo])
})

// 右键点击事件
const onRightClick = (event: MouseEvent) => {
    // 记录当前右键点击的图片
    store.photo.SetCurrentRightClick(props.photo)
    // 显示右键菜单
    store.ctxMenu.Show(event)
}

// 左键点击事件
const onLeftClick = () => {
    // 如果右键菜单处于显示状态，则隐藏右键菜单
    if (store.ctxMenu.visaible) {
        store.ctxMenu.Hide()
        return
    }

    // 如果启用了多选，那么左键点击将切换当前图片的选择状态
    if (store.photo.selection.enabled) {
        selected.value = !selected.value
        return
    }

    // 否则，直接打开当前图片的详情页面
    if (store.imageViewer.visible) {
        store.imageViewer.Hide()
    }
    store.imageViewer.Show(props.photo)
}
</script>

<template>
    <div
        id="photo-card"
        :title="store.photo.selection.enabled ? '点击选择' : '点击查看原图'"
        @click.prevent="onLeftClick"
        @contextmenu.prevent="onRightClick"
    >
        <div class="photo-card-loading-overlay" v-show="loading">
            <span></span>
        </div>
        <div class="photo-card-overlay" v-show="store.photo.selection.enabled" :class="{ selected: selected }">
            <i class="bx bx-check"></i>
        </div>
        <img
            :key="photo.id"
            :class="{ loaded: !loading }"
            :src="store.photo.GetThumbnailPath(store.user.GetUser(), photo)"
            loading="lazy"
            alt=""
            @load="loading = false"
        />
    </div>
</template>

<style lang="stylus" scoped>
#photo-card {
    position: relative;
    height: 16rem;
    border-radius: 0.5rem;
    overflow: hidden;
    transition: filter .2s;

    div.photo-card-loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 1px solid var(--photo-card-loading-border-color);
        z-index: 2;

        span {
            position: absolute;
            top: 0;
            bottom: 0;
            margin: auto;

            display: block;
            width: 1rem;
            height: 200%;
            background-color: var(--photo-card-loading-flash-color);
            filter: blur(2rem);
            transform: rotate(45deg);
            animation: loading-overlay-animate 2s linear infinite;
        }

        @keyframes loading-overlay-animate {
            0% {
                left: -200%;
            }
            100% {
                left: 200%;
            }
        }
    }

    div.photo-card-overlay {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        color: var(--photo-card-overlay-text-color);
        font-size: 4rem;
        background-color: var(--photo-card-overlay-bg-color);
        opacity: 0;
        z-index: 1;
        transition: opacity .2s;
    }

    div.photo-card-overlay.selected {
        opacity: 1;
    }

    @keyframes fade-in {
        0% {
            opacity: 0;
            transform: scale(1.2);
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;

        &.loaded {
            animation: fade-in 1s forwards;
        }
    }
}
</style>
