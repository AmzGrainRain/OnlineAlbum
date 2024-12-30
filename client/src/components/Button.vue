<script setup lang="ts">
defineProps({
    active: {
        type: Boolean,
        default: false
    },
    disable: {
        type: Boolean,
        default: false
    },
    fontSize: {
        type: String,
        default: '.875rem'
    },
    width: {
        type: String,
        default: 'fit-content'
    }
})
</script>

<template>
    <button
        class="button"
        :class="{ active: active }"
        :style="{ width: width, fontSize: fontSize }"
        :disabled="disable"
    >
        <slot></slot>
    </button>
</template>

<style scoped>
button {
    padding: .2rem .4rem .2rem;
    display: inline-block;
    color: var(--button-text-color);
    height: 2rem;
    font-size: inherit;
    border: 2px solid var(--button-border-color);
    border-radius: var(--button-border-radius);
    background-color: var(--button-background-color);
    box-sizing: border-box;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
        border-color: var(--button-hover-border-color);
    }
}

button.active {
    border-color: var(--button-hover-border-color);
}
</style>
