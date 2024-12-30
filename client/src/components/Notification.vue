<script setup lang="ts">
import { useNotificationStore } from '../store/notification'

const store = {
    notification: useNotificationStore()
}
</script>

<template>
    <div id="notification-list">
        <transition-group name="fade" tag="ul">
            <li
                v-for="item in store.notification.list"
                :key="item.timestamp"
                :style="{ borderColor: item.type }"
                @click="store.notification.Remove(item.timestamp)"
            >
                <h2>{{ item.message }}</h2>
            </li>
        </transition-group>
    </div>
</template>

<style lang="stylus" scoped>
#notification-list {
    position: fixed;
    top: 0;
    right: 0;
    padding: 1rem;
    padding-top: 4.5rem;
    height: 100vh;
    box-sizing: border-box;
    pointer-events: none;
    z-index: 9999;

    ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        li {
            padding: .5rem;
            margin-bottom: 1rem;
            max-width: 20rem;
            border: 2px solid;
            border-radius: var(--notification-border-radius);
            background-color var(--notification-background-color);
            backdrop-filter: blur(.5rem);
            box-sizing: border-box;
            pointer-events: auto;
            transition: .2s ease-in-out;

            h2 {
                font-size: .8rem;
                font-weight: normal;
            }
        }
    }
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateX(0);
}
</style>
