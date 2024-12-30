<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { useStore } from '../store'
import { usePhotoStore } from '../store/photo'
import { useDialogStore, DialogType } from '../store/dialog'
import { useContextMenuStore } from '../store/context_menu'
import { useNotificationStore, NotificationType } from '../store/notification'
import { useImageViewerStore } from '../store/image_viewer'
import { useUserStore } from '../store/user'

import { DeletePhoto as DeletePhotoAPI } from '../api/photo/delete'
import { PhotoT } from '../model'

const store = {
    global: useStore(),
    photo: usePhotoStore(),
    imageViewer: useImageViewerStore(),
    ctxMenu: useContextMenuStore(),
    user: useUserStore(),
    dialog: useDialogStore(),
    notification: useNotificationStore()
}

// 右键菜单元素
const contextMenuEl = ref<HTMLDivElement | null>(null)

// 点击时检查是否点击了右键菜单，若不是则隐藏右键菜单
const closeContextMenu = (e: MouseEvent) => {
    if (contextMenuEl.value && !contextMenuEl.value.contains(e.target as Node)) {
        store.ctxMenu.Hide()
    }
}

// 组件挂载时注册点击事件
onMounted(() => {
    document.addEventListener('click', closeContextMenu)
})

// 组件销毁时注销点击事件
onBeforeUnmount(() => {
    document.removeEventListener('click', closeContextMenu)
})

/**
 * 显示当前右键点击的图片详情
 * 此函数仅当用户处于单选状态时才会被调用，所以不需要考虑多选状态的情况
 */
const showPhoto = (): void => {
    store.ctxMenu.Hide()

    const currentSelected = store.photo.GetCurrentRightClick()
    if (!currentSelected) {
        store.notification.New('请先右键选择图片')
        return
    }

    store.imageViewer.Show(currentSelected)
}

/**
 * 下载当前选中的图片
 * 此函数会根据当前的选择状态来决定是下载单张图片还是下载多张图片
 */
const downloadSelectedPhoto = async (): Promise<void> => {
    store.ctxMenu.Hide()

    try {
        if (!store.photo.selection.enabled) {
            const currentSelected = store.photo.GetCurrentRightClick()
            if (!currentSelected) {
                store.notification.New('请先右键选择图片')
                return
            }
            store.notification.New('已开始下载...')
            await store.photo.Download(store.user.GetUser(), [currentSelected])
            store.notification.New('已下载完成', NotificationType.SUCCESS)

            return
        }

        //----------------------------------------

        const currentSelected = store.photo.GetCurrentSelected()
        if (currentSelected.length === 0) {
            store.notification.New('请先右键选择图片')
            return
        }
        store.notification.New('已开始下载...')
        await store.photo.Download(store.user.GetUser(), currentSelected)
        store.notification.New('已下载完成', NotificationType.SUCCESS)
    } catch (e) {
        console.error(e)
        store.notification.New('遇到了一些问题，请打开控制台查看错误信息', NotificationType.ERROR)
    }
}

/**
 * 复制当前选中的图片链接到剪贴板
 * 此函数会根据当前的选择状态来决定是复制单张图片链接还是复制多张图片链接
 */
const copyLink = async (): Promise<void> => {
    store.ctxMenu.Hide()

    try {
        // 单选状态
        if (!store.photo.selection.enabled) {
            // 无法获得当前右键点击的图片信息，则提示错误信息
            const currentSelected = store.photo.GetCurrentRightClick()
            if (!currentSelected) {
                store.notification.New('请先右键选择图片')
                return
            }
            await navigator.clipboard.writeText(store.photo.GetURL(store.user.GetUser(), currentSelected))
            store.notification.New('图片链接已复制到剪贴板', NotificationType.SUCCESS)
            return
        }

        // 多选状态 如果没有选中任何图片，则提示错误信息
        const currentSelected = store.photo.GetCurrentSelected()
        if (currentSelected.length === 0) {
            store.notification.New('请先右键选择图片')
            return
        }

        let links: string = ''
        for (const photo of currentSelected) {
            links += store.photo.GetURL(store.user.GetUser(), photo)
            links += '\n'
        }
        await navigator.clipboard.writeText(links)
        store.notification.New('图片链接已复制到剪贴板', NotificationType.SUCCESS)
    } catch (error) {
        store.notification.New('遇到了一些问题，请打开控制台查看错误信息', NotificationType.ERROR)
    }
}

/**
 * 切换当前的选择状态
 * 此函数会根据当前的选择状态来决定是切换到单选状态还是切换到多选状态
 */
const turnSelection = (): void => {
    store.ctxMenu.Hide()
    store.photo.ToggleMultipleChoice()

    // 右键切换到多选状态时，将当前右键点击的图片添加到已选中列表
    if (store.photo.selection.enabled) {
        store.photo.AddToSelected([store.photo.GetCurrentRightClick() as PhotoT])
    }

    const message = store.photo.selection.enabled ? '已切换到多选状态' : '已切换到单选状态'
    store.notification.New(message)
}

/**
 * 保存当前选中的图片到指定分类
 */
const savePhotoToCategory = (): void => {
    store.ctxMenu.Hide()
    store.dialog.ShowCategoryDialog()
}

/**
 * 删除当前选中的图片
 * 此函数会根据当前的选择状态来决定是删除单张图片还是删除多张图片
 */
const removePhoto = async (): Promise<void> => {
    store.ctxMenu.Hide()
    if (!(await store.dialog.Confirm('警告', '确定要删除选中的图片吗？', DialogType.WARNING))) {
        return
    }
    store.global.SetLoading(true)

    if (!store.photo.selection.enabled) {
        const currentSelected = store.photo.GetCurrentRightClick()
        if (!currentSelected) {
            store.notification.New('请先右键选择图片', NotificationType.INFO)
            return
        }

        try {
            await DeletePhotoAPI([currentSelected.id])
        } catch (e) {
            console.error(e)
            store.notification.New('遇到了一些问题，请打开控制台查看错误信息', NotificationType.ERROR)
        }

        store.photo.Remove([currentSelected])
        store.photo.ToggleMultipleChoice(false)
        store.global.SetLoading(false)
        return
    }

    //---------------------------------------

    const currentSelected = store.photo.GetCurrentSelected()
    if (currentSelected.length === 0) {
        store.notification.New('请先选择图片', NotificationType.WARNING)
        return
    }

    const indexes: number[] = []
    for (const photo of currentSelected) {
        indexes.push(photo.id)
    }

    try {
        await DeletePhotoAPI(indexes)
        store.photo.Remove(currentSelected)
        store.notification.New('删除图片成功', NotificationType.SUCCESS)
    } catch (e) {
        console.error(e)
        store.notification.New('遇到了一些问题，请打开控制台查看错误信息', NotificationType.ERROR)
    }

    store.photo.ToggleMultipleChoice(false)
    store.global.SetLoading(false)
}
</script>

<template>
    <div
        id="context-menu"
        ref="contextMenuEl"
        :style="{ top: `${store.ctxMenu.offsetY}px`, left: `${store.ctxMenu.offsetX}px` }"
        @focusout="store.ctxMenu.Hide()"
    >
        <button @click="showPhoto()" v-show="!store.photo.selection.enabled || !store.imageViewer.visible"><i class="bx bx-show"></i>查看原图</button>
        <button @click="downloadSelectedPhoto()"><i class="bx bxs-save"></i>{{ store.photo.selection.enabled ? '批量下载' : '下载图片' }}</button>
        <button @click="copyLink()"><i class="bx bx-copy"></i>复制链接</button>
        <button @click="turnSelection()"><i class="bx bx-select-multiple"></i>{{ store.photo.selection.enabled ? '取消多选' : '批量选择' }}</button>
        <button @click="savePhotoToCategory()"><i class="bx bx-category-alt"></i>移动分类</button>
        <button @click="removePhoto()" style="--context-menu-hover-bg-color: #f006"><i class="bx bx-recycle"></i>删除图片</button>
    </div>
</template>

<style lang="stylus" scoped>
#context-menu {
    padding: .125rem;
    position: absolute;
    display: flex;
    flex-direction: column;
    font-size: .875rem;
    color: var(--context-menu-text-color);
    border: 1px solid var(--context-menu-border-color);
    border-radius: var(--context-menu-border-radius);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    background-color: var(--context-menu-bg-color);
    backdrop-filter: blur(.5rem);
    box-sizing: border-box;
    overflow hidden
    z-index: 9998;

    button {
        padding: .375rem .75rem .375rem .5rem;
        color: inherit;
        text-align: left;
        border: none;
        border-radius: calc(var(--context-menu-border-radius) - 2px);
        background-color: transparent;
        outline: none;
        cursor: pointer;

        &:hover {
            background-color: var(--context-menu-hover-bg-color);
        }

        &:last-child {
            border-bottom: none;
        }

        i {
            padding-right: .4rem;
        }
    }
}
</style>
