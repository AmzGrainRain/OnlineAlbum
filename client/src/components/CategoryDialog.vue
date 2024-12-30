<script lang="ts" setup>
import { useDialogStore } from '../store/dialog'
import { usePhotoStore } from '../store/photo'
import { useNotificationStore, NotificationType } from '../store/notification'

import { ChangeCategory as ChangeCategoryAPI } from '../api/photo/change-category'
import { useStore } from '../store'

const store = {
    global: useStore(),
    dialog: useDialogStore(),
    photo: usePhotoStore(),
    notification: useNotificationStore()
}

const addPhotoToCategory = async (id: number) => {
    try {
        if (store.photo.selection.enabled) {
            const currentSelected = store.photo.GetCurrentSelected()
            if (currentSelected.length === 0) {
                store.notification.New('请先选择照片', NotificationType.ERROR)
                return
            }

            // 从云端图库删除
            await ChangeCategoryAPI(
                currentSelected.map((p) => p.id),
                id
            )
            // 从本地缓存删除
            store.photo.Remove(currentSelected)

            const categoryName = store.photo.categories.find((c) => c.id === id)?.name
            store.notification.New(`已移动到 ${categoryName} 分类`)
            return
        }

        // ---------------------------

        const currentSelected = store.photo.GetCurrentRightClick()
        if (!currentSelected) {
            store.notification.New('请先选择照片', NotificationType.ERROR)
            return
        }

        // 从云端图库删除
        await ChangeCategoryAPI([currentSelected.id], id)
        // 从本地缓存删除
        store.photo.Remove([currentSelected])

        const categoryName = store.photo.categories.find((c) => c.id === id)?.name
        store.notification.New(`已移动到 ${categoryName} 分类`)
        return
    } catch (error) {
        console.error(error)
        store.notification.New(String(error), NotificationType.ERROR)
    } finally {
        store.dialog.CloseCategoryDialog()
        store.photo.ResetSelection()
    }
}
</script>

<template>
    <div id="category-dialog" @click="store.dialog.CloseCategoryDialog()">
        <div class="box" @click.stop>
            <div class="title">
                <h2>添加照片到分类</h2>
                <div @click="store.dialog.CloseCategoryDialog()">
                    <i class="bx bx-x"></i>
                </div>
            </div>
            <ul>
                <li v-for="category in store.photo.categories" :key="category.id" @click="addPhotoToCategory(category.id)">{{ category.name }}</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
#category-dialog {
    position: absolute;
    top: 3.5rem;
    left: 0;
    z-index: 1;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100vw;
    height: calc(100vh - 3.5rem);
    background-color: var(--mask-background-color);

    div.box {
        padding: 0.5rem;
        width: 20rem;
        border: 2px solid var(--category-dialog-border-color);
        border-radius: var(--category-dialog-border-radius);
        background-color: var(--category-dialog-background-color);

        div.title {
            padding-bottom: 0.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            border-bottom: 1px solid var(--category-dialog-border-color);

            h2 {
                display: inline-block;
                margin: 0;
                font-size: 1rem;
                font-weight: normal;
                text-indent: 0.2rem;
            }

            div {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 2rem;
                height: 2rem;
                font-size: large;
                text-align: center;
                border: 2px solid var(--button-border-color);
                border-radius: var(--button-border-radius);
                box-sizing: border-box;
                transition: border 0.2s;
                cursor: pointer;

                &:hover {
                    border-color: var(--button-hover-border-color);
                }

                i {
                    transform: translateY(-0.5px);
                }
            }
        }

        ul {
            padding-top: 0.5rem;
            list-style: none;
            display: flex;
            gap: 0.5rem;

            li {
                padding: 0.2rem 0.5rem;
                border: 2px solid var(--category-dialog-border-color);
                border-radius: var(--category-dialog-border-radius);
                transition: border 0.2s;
                user-select: none;
                cursor: pointer;

                &:hover {
                    border-color: var(--category-dialog-hover-border-color);
                }
            }
        }
    }
}
</style>
