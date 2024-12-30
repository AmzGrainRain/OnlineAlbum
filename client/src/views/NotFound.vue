<script lang="ts" setup>
import Button from '../components/Button.vue'
import { useStore } from '../store'
const store = useStore()
store.SetLoading(false)
</script>

<template>
    <h1>无法找到页面</h1>
    <p>请检查地址是否正确或联系管理员。</p>
    <br>
    <RouterLink to="/">
        <Button>返回首页</Button>
    </RouterLink>
</template>

<style lang="stylus" scoped>

</style>
