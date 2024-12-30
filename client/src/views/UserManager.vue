<script lang="ts" setup>
import { ref } from 'vue'
import { UserT } from '../model'

import { ListUser as ListUserAPI } from '../api/auth/list'
import { Regist as RegistUserAPI } from '../api/auth/regist'
import { Rename as RenameUserAPI  } from '../api/auth/rename'
import { Delete as DeleteUserAPI } from '../api/auth/delete'

import { useStore } from '../store'
import { useUserStore } from '../store/user'
import { usePhotoStore } from '../store/photo'
import { useDialogStore } from '../store/dialog'
import { useContextMenuStore } from '../store/context_menu'
import { useNotificationStore, NotificationType } from '../store/notification'

import Button from '../components/Button.vue'

const store = {
    global: useStore(),
    user: useUserStore(),
    photo: usePhotoStore(),
    ctxMenu: useContextMenuStore(),
    notification: useNotificationStore(),
    dialog: useDialogStore()
}
store.global.$Init()

/**
 * 修改用户名
 * @param user_id 用户ID
 */
const changUserName = async (user_id: number) => {
    const name = await store.dialog.Prompt('重命名用户', '请输入新用户昵称')
    if (name.length === 0) {
        store.notification.New('昵称不能为空', NotificationType.ERROR)
        return
    }
    store.dialog.Reset()

    try {
        store.global.SetLoading(true)
        await RenameUserAPI(user_id, name)
        await refreshUserList()
        store.global.SetLoading(false)
        store.notification.New('重命名用户成功', NotificationType.SUCCESS)
    }
    catch (error) {
        console.error(error)
        store.notification.New(String(error), NotificationType.ERROR)
    }
}

/**
 * 删除用户
 * @param user_id 用户ID
 */
const deleteUser = async (user_id: number) => {
    if (user_id === 0) {
        store.notification.New('无法删除超级管理员', NotificationType.ERROR, 5000)
        return
    }

    if (!(await store.dialog.Confirm('确认删除用户', '确认删除该用户吗？'))) {
        store.notification.New('取消删除用户', NotificationType.INFO)
        return
    }
    store.dialog.Reset()

    try {
        await DeleteUserAPI(user_id)
        await refreshUserList()
        store.notification.New('删除用户成功', NotificationType.SUCCESS)
    }
    catch (error) {
        console.error(error)
        store.notification.New(String(error), NotificationType.ERROR)
    }
}

/**
 * 刷新用户列表
 */
const userList = ref<UserT[]>([])
const refreshUserList = async () => {
    try {
        store.global.SetLoading(true)
        const resp = await ListUserAPI()
        userList.value.length = 0
        userList.value.push(...resp.data)
    }
    catch (error) {
        console.error(error)
        store.notification.New(String(error), NotificationType.ERROR)
    }
    finally {
        store.global.SetLoading(false)
    }
}
refreshUserList()

/**
 * 创建用户
 */
const createUser = async () => {
    const name = await store.dialog.Prompt('创建用户', '请输入新用户昵称')
    if (name.length === 0) {
        store.notification.New('昵称不能为空', NotificationType.ERROR)
        return
    }
    store.dialog.Reset()

    const email = await store.dialog.Prompt('创建用户', '请输入新用户邮箱')
    if (email.length === 0) {
        store.notification.New('邮箱不能为空', NotificationType.ERROR)
        return
    }
    store.dialog.Reset()

    const password = await store.dialog.Prompt('创建用户', '请输入新用户密码')
    if (password.length === 0) {
        store.notification.New('密码不能为空', NotificationType.ERROR)
        return
    }
    store.dialog.Reset()

    const confirmPassword = await store.dialog.Prompt('创建用户', '请再次输入新用户密码')
    if (confirmPassword.length === 0) {
        store.notification.New('确认密码不能为空', NotificationType.ERROR)
        return
    }
    store.dialog.Reset()

    if (password!== confirmPassword) {
        store.notification.New('两次输入的密码不一致', NotificationType.ERROR)
        return
    }
    store.dialog.Reset()

    try {
        await RegistUserAPI(name, email, password)
        await refreshUserList()
        store.notification.New('创建用户成功', NotificationType.SUCCESS)
    }
    catch (error) {
        console.error(error)
        store.notification.New(String(error), NotificationType.ERROR)
    }
}
</script>

<template>
    <table id="user-manager">
        <thead>
            <tr>
                <th>索引</th>
                <th>昵称</th>
                <th>邮箱</th>
                <th>管理员</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="user in userList" :key="user.id" :title="new Date(user.created_at).toString()">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.is_admin }}</td>
                <td>
                    <Button @click="changUserName(user.id)">重命名</Button>
                    <Button @click="deleteUser(user.id)">删除</Button>
                </td>
            </tr>
            <tr>
                <td colspan="5" style="text-align: right">
                    <Button v-if="store.user.user?.id === 0" @click="createUser">创建用户</Button>
                    <Button @click="refreshUserList">刷新</Button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped lang="stylus">
#user-manager {
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
