<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'

import { useImageViewerStore } from '../store/image_viewer'
import { usePhotoStore } from '../store/photo.ts'
import { useUserStore } from '../store/user.ts'

import { PhotoT } from '../model.ts'

const store = {
    photo: usePhotoStore(),
    user: useUserStore(),
    imageViewer: useImageViewerStore()
}

// 缩放系数
const scaleFactor = ref(1.0)

// 鼠标滚轮事件
const handleWheel = (e: WheelEvent) => {
    if (e.deltaY > 0) {
        scaleFactor.value = Math.max(scaleFactor.value - 0.1, 0.1);
    }
    else {
        scaleFactor.value += 0.1;
    }
}

// 是否正在拖动
let isDragging = false

// 元素位置
const position = reactive({
    start: { x: 0, y: 0 },
    current: { x: 0, y: 0 }
})

// 开始拖动
const dragStart = (event: MouseEvent) => {
    isDragging = true
    position.start.x = event.clientX - position.current.x
    position.start.y = event.clientY - position.current.y
}

// 正在拖动
const dragging = (event: MouseEvent) => {
    if (!isDragging) return
    position.current.x = event.clientX - position.start.x
    position.current.y = event.clientY - position.start.y
}

// 结束拖动
const dragEnd = (_: MouseEvent) => {
    isDragging = false
}

// 图片路径
const photoUrl = ref('')
watch(
    () => store.imageViewer.photo,
    (nv: PhotoT | null) => {
        scaleFactor.value = 1.0
        position.current.x = 0
        position.current.y = 0
        photoUrl.value = ''
        if (nv) {
            photoUrl.value = store.photo.GetPath(store.user.GetUser(), nv)
        }
    }
)
</script>

<template>
    <div
        id="image-viewer"
        @wheel.prevent="handleWheel"
        @mousedown="dragStart" @mousemove="dragging" @mouseup="dragEnd"
        @contextmenu.prevent="store.imageViewer.Hide()"
    >
        <img
            :src="photoUrl"
            :style="{
                '--y': position.current.y + 'px',
                '--x': position.current.x + 'px',
                '--scale': scaleFactor
            }"
            alt=""
            draggable="false"
        />
    </div>
</template>

<style scoped>
#image-viewer {
    position: absolute;
    top: 3.5rem;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: calc(100vh - 3.5rem);
    background-color: var(--mask-background-color);
    overflow: hidden;
    z-index: 1;

    img {
        display: block;
        height: 80%;
        transform: scale(var(--scale)) translate(var(--x), var(--y));
    }
}
</style>
