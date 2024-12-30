<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { DialogType, DialogAction, useDialogStore } from '../store/dialog'

import Button from '../components/Button.vue'
import InputBox from '../components/InputBox.vue'

const store = {
    dialog: useDialogStore()
}

// 拖动中
let isDragging = false

// 位置
const position = reactive({
    start: { x: 0, y: 0 },
    current: { x: 0, y: 0 }
})

// 开始拖动
const dragStart = (event: MouseEvent) => {
    isDragging = true
    position.start.x = event.clientX - position.current.x
    position.start.y = event.clientY - position.current.y
}

// 拖动中
const dragging = (event: MouseEvent) => {
    if (!isDragging) return
    position.current.x = event.clientX - position.start.x
    position.current.y = event.clientY - position.start.y
}

// 结束拖动
const dragEnd = (_: MouseEvent) => {
    isDragging = false
}

// 输入框内容
const inputBoxContent = ref('')
</script>

<template>
    <div id="dialog-overlay" @click="store.dialog.Reset()">
        <div
            class="dialog-box"
            :style="{
                '--y': position.current.y + 'px',
                '--x': position.current.x + 'px'
            }"
            @click.stop
        >
            <div class="dialog-title" @mousedown="dragStart" @mousemove="dragging" @mouseup="dragEnd">
                <i v-show="store.dialog.type === DialogType.WARNING" class="bx bx-error-circle"></i>
                <i v-show="store.dialog.type === DialogType.INFO" class="bx bx-info-circle"></i>
                <i v-show="store.dialog.type === DialogType.SUCCESS" class="bx bx-info-circle"></i>
                <i v-show="store.dialog.type === DialogType.ERROR" class="bx bx-error"></i>
                <h1>{{ store.dialog.title }}</h1>
            </div>

            <div class="dialog-content">
                {{ store.dialog.message }}
            </div>

            <div class="dialog-actions">
                <div v-if="store.dialog.actionType === DialogAction.CONFIRM" class="dialog-action-confirm">
                    <Button @click="store.dialog.EmitConfirm(true)">确认</Button>&nbsp;
                    <Button @click="store.dialog.EmitConfirm(false)">取消</Button>
                </div>

                <div v-if="store.dialog.actionType === DialogAction.ALERT" class="dialog-action-alert">
                    <Button @click="store.dialog.EmitAlert()">关闭</Button>
                </div>

                <div v-if="store.dialog.actionType === DialogAction.PROMPT" class="dialog-action-prompt">
                    <InputBox width="calc(100% - 4rem)" @on-change="(v: string) => inputBoxContent = v" @on-enter="store.dialog.EmitPrompt(inputBoxContent)" />
                    <Button width="3.5rem" @click="store.dialog.EmitPrompt(inputBoxContent)">提交</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="stylus" scoped>
#dialog-overlay {
    position: fixed;
    top: 3.5rem;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: calc(100vh - 3.5rem);
    background-color: var(--mask-background-color);
    z-index 9998;

    div.dialog-box {
        transform: translate(var(--x), var(--y));
        width: 22rem;
        margin: auto;
        border-radius: var(--dialog-border-radius);
        background-color: var(--dialog-background-color);
        box-sizing: border-box;
        overflow: hidden;

        div.dialog-title {
            padding: .25rem .5rem;
            width: 100%;
            height: 2rem;

            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            background-color: var(--dialog-title-background-color);
            box-sizing: border-box;

            i {
                vertical-align: middle;
            }

            h1 {
                padding-left: .2rem;
                display: inline;
                font-size: 1rem;
                font-weight: normal;
                pointer-events: none;
                user-select: none;
            }
        }

        div.dialog-content {
            padding: .5rem;
            width: 100%;
            height: 8rem;
            font-size: .875rem;
            user-select: none;
            overflow: hidden auto;
            box-sizing: border-box;
        }

        div.dialog-actions {
            padding: 0 .5rem .5rem .5rem;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            box-sizing: border-box;

            div {
                width: 100%;
                text-align: right;
            }

            div.dialog-action-prompt {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }
    }
}
</style>
