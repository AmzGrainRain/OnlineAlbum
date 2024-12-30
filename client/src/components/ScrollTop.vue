<script lang="ts" setup>
import { useStore } from '../store'
import { useNotificationStore, NotificationType } from '../store/notification';

const store = {
    global: useStore(),
    notification: useNotificationStore()
}

const handleClick = () => {
    if (!store.global.containerElement) return
    store.global.containerElement.scrollTo({ top: 0, behavior:'smooth' })
    store.notification.New('已到达顶部', NotificationType.INFO, 1000)
}
</script>

<template>
    <div id="scroll-top" @click="handleClick">
        <i class='bx bx-arrow-to-top'></i>
    </div>
</template>

<style scoped>
#scroll-top {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    right: 2rem;
    bottom: 2rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 1px solid var(--scroll-top-button-border-color);
    background-color: var(--scroll-top-button-background-color);
    backdrop-filter: blur(.2rem);
    box-sizing: border-box;
    transition: all .3s;
    cursor: pointer;

    i {
        font-size: 1.5rem;
        color: var(--scroll-top-button-icon-color);
    }

    &:hover {
        background-color: var(--scroll-top-button-hover-background-color);
    }
}
</style>
