<script lang="ts" setup>
import { useRouter } from 'vue-router'

import { useStore } from '../store'
import { useContextMenuStore } from '../store/context_menu'
import { usePhotoStore } from '../store/photo'
import { useDialogStore } from '../store/dialog'
import { useNotificationStore, NotificationType } from '../store/notification'

import { AddCategory as AddCategoryAPI } from '../api/category/add'
import { DeleteCategory as DeleteCategoryAPI } from '../api/category/delete'
import { RenameCategory as RenameCategoryAPI } from '../api/category/rename'

import Button from '../components/Button.vue'

const router = useRouter()
const store = {
    global: useStore(),
    photo: usePhotoStore(),
    ctxMenu: useContextMenuStore(),
    notification: useNotificationStore(),
    dialog: useDialogStore()
}
store.global.$Init()

/**
 * 获取图片分类列表
 */
const getCategories = async () => {
    store.global.SetLoading(true)
    if (!(await store.photo.FetchCategories())) {
        store.notification.New('获取图片分类失败', NotificationType.ERROR)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    store.global.SetLoading(false)
}
getCategories()

/**
 * 删除分类
 * @param id 分类ID
 */
const deleteCategory = async (id: number) => {
    if (id === 0) {
        store.notification.New('不能删除默认分类', NotificationType.ERROR)
        return
    }

    if (!(await store.dialog.Confirm('确认删除分类', '删除分类会同时将该分类下的所有图片重新放入 “未分类” 分类，确定要删除吗？'))) {
        store.notification.New('取消操作', NotificationType.INFO)
        return
    }

    try {
        await DeleteCategoryAPI(id)
        store.photo.categories.forEach((category, index) => {
            if (category.id === id) {
                store.photo.categories.splice(index, 1)
            }
        })
        store.notification.New('删除分类成功', NotificationType.SUCCESS)
    } catch (e) {
        console.error(e)
        store.notification.New('删除分类失败', NotificationType.ERROR)
    }
}

/**
 * 重命名分类
 * @param id 分类ID
 */
const renameCategory = async (id: number) => {
    const name = await store.dialog.Prompt('重命名分类', '请输入新的分类名称')
    if (!name.length || name.length > 30) {
        store.notification.New('分类名称不能为空且不能超过30个字符', NotificationType.ERROR)
        return
    }

    try {
        await RenameCategoryAPI(id, name)
        store.photo.categories.forEach((category) => {
            if (category.id === id) {
                category.name = name
            }
        })
        store.notification.New('重命名分类成功', NotificationType.SUCCESS)
    } catch (e) {
        console.error(e)
        store.notification.New('重命名分类失败', NotificationType.ERROR)
    }
}

/**
 * 创建分类
 */
const addCategory = async () => {
    const name = await store.dialog.Prompt('创建分类', '请输入新的分类名称')
    if (!name.length || name.length > 30) {
        store.notification.New('分类名称不能为空且不能超过30个字符', NotificationType.ERROR)
        return
    }

    try {
        store.global.SetLoading(true)
        await AddCategoryAPI(name)
        await getCategories()
        store.notification.New('创建分类成功', NotificationType.SUCCESS)
    } catch (e) {
        console.error(e)
        store.notification.New('创建分类失败', NotificationType.ERROR)
    } finally {
        store.global.SetLoading(false)
    }
}

/**
 * 刷新分类
 */
const refreshCategory = async () => {
    await getCategories()
    store.notification.New('刷新图片分类成功', NotificationType.SUCCESS)
}
</script>

<template>
    <table id="categories">
        <thead>
            <tr>
                <th>索引</th>
                <th>名称</th>
                <th>图片数量</th>
                <th>创建时间</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="category in store.photo.categories" :key="category.id">
                <td>{{ category.id }}</td>
                <td>{{ category.name }}</td>
                <td>{{ category.count }}</td>
                <td>{{ category.created_at }}</td>
                <td>
                    <Button @click="deleteCategory(category.id)">删除</Button>
                    <Button @click="renameCategory(category.id)">重命名</Button>
                    <Button @click="router.push({path: '/', query: {category: category.id}})">查看</Button>
                </td>
            </tr>
            <tr>
                <td colspan="5" style="text-align: right">
                    <Button @click="addCategory()">添加分类</Button>
                    <Button @click="refreshCategory()">刷新</Button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped lang="stylus">
#categories {
    margin: 0 auto;
    max-width: 1200px;
    width: 100%;
    border-collapse: collapse;
    border-radius: var(--category-border-radius);
    overflow: hidden;
    box-sizing: border-box;

    thead {
        background-color: var(--category-table-header-color);

        th {
            padding: .5rem;
            font-weight: normal;
        }
    }

    tbody {
        tr {
            td {
                padding: .5rem;
                text-align: center;
                border: 1px solid var(--category-table-border-color);
                box-sizing: border-box;

                button {
                    margin-left: .5rem;

                    &:first-child {
                        margin-left: 0;
                    }
                }
            }
        }
    }
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
