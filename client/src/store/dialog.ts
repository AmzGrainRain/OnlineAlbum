import { defineStore } from 'pinia'
import { watch } from 'vue'

enum DialogType {
    INFO = 0,
    SUCCESS = 1,
    ERROR = 2,
    WARNING = 3
}

enum DialogAction {
    CONFIRM = 'confirm',
    ALERT = 'alert',
    PROMPT = 'prompt'
}

const useDialogStore = defineStore('dialog', {
    state: () => ({
        visible: false,
        categoryDialogVisible: false,
        title: 'test',
        message: 'content',
        type: null as DialogType | null,
        actionType: null as DialogAction | null,
        $userChoice: null as string | null,
    }),
    getters: {},
    actions: {
        Reset(): void {
            this.visible = false
            this.title = ''
            this.message = ''
            this.type = null
            this.$userChoice = null
        },

        ShowCategoryDialog() {
            this.categoryDialogVisible = true
        },

        CloseCategoryDialog() {
            this.categoryDialogVisible = false
        },

        Confirm(title: string, message: string, type: DialogType = DialogType.INFO): Promise<boolean> {
            this.title = title
            this.message = message
            this.type = type
            this.actionType = DialogAction.CONFIRM
            this.visible = true
            this.$userChoice = null
            return new Promise((resolve) => {
                const stopWatch = watch(() => this.visible, (value: boolean) => {
                    if (!value) {
                        resolve(this.$userChoice === 'true')
                        stopWatch()
                        this.$userChoice = null
                    }
                })
            })
        },

        EmitConfirm(choice: boolean): void {
            this.$userChoice = choice.toString()
            this.visible = false
        },

        Alert(title: string, message: string, type: DialogType = DialogType.INFO): Promise<void> {
            this.title = title
            this.message = message
            this.type = type
            this.actionType = DialogAction.ALERT
            this.visible = true
            return new Promise((resolve) => {
                const stopWatch = watch(() => this.visible, (value: boolean) => {
                    if (!value) {
                        resolve()
                        stopWatch()
                        this.$userChoice = null
                    }
                })
            })
        },

        EmitAlert(): void {
            this.visible = false
        },

        Prompt(title: string, message: string, type: DialogType = DialogType.INFO): Promise<string> {
            this.title = title
            this.message = message
            this.type = type
            this.actionType = DialogAction.PROMPT
            this.visible = true
            return new Promise((resolve) => {
                const stopWatch = watch(() => this.visible, (value: boolean) => {
                    if (!value) {
                        resolve(this.$userChoice || '')
                        stopWatch()
                        this.$userChoice = null
                    }
                })
            })
        },

        EmitPrompt(value: string): void {
            this.$userChoice = value
            this.visible = false
        }
    }
})

export { useDialogStore, DialogType, DialogAction }
