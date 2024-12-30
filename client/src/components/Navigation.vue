<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { useStore } from '../store'
import { useUserStore } from '../store/user'

import { UploadPhoto } from '../api/photo/upload'

const route = useRoute()
const store = {
    global: useStore(),
    user: useUserStore()
}

const ImageSelector = ref<HTMLInputElement | null>(null)

const openImageSelector = () => {
    if (ImageSelector.value) {
        ImageSelector.value.click()
    }
}

const handleImageSelectorChange = async () => {
    if (!ImageSelector.value || !ImageSelector.value.files) {
        alert('请选择图片')
        return
    }

    store.global.SetLoading(true)
    const resp = await UploadPhoto(ImageSelector.value.files as FileList)
    store.global.SetLoading(false)
    if (!resp || !resp.success) {
        alert('上传失败')
        return
    }

    alert('上传成功')
}
</script>

<template>
    <nav>
        <ul class="left">
            <li class="home dropdown">
                <RouterLink to="/" rel="noopener noreferrer"><i class="bx bx-image-alt"></i>&nbsp;图库</RouterLink>
            </li>
            <li class="dropdown">
                <RouterLink to="/views/categories"><i class="bx bxs-category"></i>&nbsp;分类</RouterLink>
            </li>
            <li class="upload" @click="openImageSelector()">
                <input type="file" multiple accept="image/*" style="display: none" ref="ImageSelector" @change="handleImageSelectorChange()" />
                <a><i class="bx bxs-cloud-upload"></i>&nbsp;上传</a>
            </li>
            <li class="user-management" v-if="store.user.IsAdmin()">
                <RouterLink to="/views/user-management" rel="noopener noreferrer"><i class="bx bxs-user"></i>&nbsp;账号</RouterLink>
            </li>
            <li class="logout" @click="store.user.Logout()">
                <a href=""><i class='bx bx-log-in-circle'></i>&nbsp;注销</a>
            </li>
        </ul>

        <div class="page-controller" v-if="route.meta.pages">
            <button class="page-btn" :disabled="store.global.page.current <= 1" @click="--store.global.page.current">
                <i class="bx bxs-chevron-left"></i>
            </button>
            <span class="page-info">{{ store.global.page.current }} / {{ store.global.page.total }}</span>
            <button class="page-btn" :disabled="store.global.page.current >= store.global.page.total" @click="++store.global.page.current">
                <i class="bx bxs-chevron-right"></i>
            </button>
        </div>
    </nav>
</template>

<style scoped>
nav {
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 3.5rem;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 1px solid var(--nav-border-color);
    background-color: var(--nav-background-color);
    z-index: 1000;

    &>ul {
        display: flex;
        list-style: none;

        li {
            position: relative;
            margin-right: 20px;
            cursor: pointer;

            a {
                padding: 2px 8px;
                display: flex;
                align-items: center;
                border-radius: var(--nav-button-border-radius);
                border: 2px solid var(--nav-button-border-color);
                transition: border 0.2s;

                i {
                    color: var(--nav-icon-color);
                }

                &.router-link-active,
                &:hover {
                    border-color: var(--nav-button-hover-border-color);
                }
            }
        }

        li:last-child {
            margin-right: 0;
        }
    }

    > div.page-controller {
        height: 2rem;

        span {
            margin: 0 0.25rem;
            display: inline-block;
            width: 3rem;
            height: 100%;
            text-align: center;
            cursor: default;
        }

        button {
            width: 2rem;
            height: 100%;
            border: 2px solid var(--nav-button-border-color);
            border-radius: 8px;
            background-color: transparent;
            cursor: pointer;
            transition: 0.2s;

            &:hover {
                border: 2px solid var(--nav-button-hover-border-color);
            }
        }
    }
}
</style>
