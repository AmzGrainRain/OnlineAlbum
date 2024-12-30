<script lang="ts" setup>
defineProps({
    width: {
        type: String,
        default: '100%'
    },
    height: {
        type: String,
        default: '2rem'
    }
})

const emits = defineEmits(['on-change', 'on-enter'])

const emitValue = (event: Event) => {
    const target = event.target as HTMLInputElement
    emits('on-change', target.value)
}

const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key !== 'Enter') return
    emits('on-enter')
}
</script>

<template>
    <input
        type="text"
        :style="{
            width: width,
            height: height
        }"
        @keypress="handleKeyPress"
        @input="emitValue"
    />
</template>

<style lang="stylus" scoped>
input {
    display: inline-block;
    padding: 0 0.3rem;
    color: var(--input-text-color);
    border: 2px solid var(--input-border-color);
    border-radius: var(--dialog-button-border-radius);
    background-color: var(--input-background-color);
    vertical-align: bottom;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.2s;

    &:hover {
        border-color: var(--input-hover-border-color)
    }
}
</style>
