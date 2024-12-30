<script lang="ts" setup>
import { HollowDotsSpinner } from 'epic-spinners'
</script>

<template>
    <div id="loading-overlay" ref="el">
        <hollow-dots-spinner
            :animation-duration="1000"
            :dot-size="15"
            :dots-num="3"
            color="#e66"
        />
    </div>
</template>

<style lang="stylus" scoped>
#loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column wrap;
    width: 100vw;
    height: 100vh;
    background-color var(--mask-background-color);
    z-index 9999;
}
</style>
