import { defineStore } from 'pinia'

const useContextMenuStore = defineStore('context-menu', {
    state: () => ({
        visaible: false,
        offsetX: 0,
        offsetY: 0
    }),
    getters: {},
    actions: {
        Reset() {
            this.visaible = false
            this.offsetX = 0
            this.offsetY = 0
        },

        Show(event: MouseEvent) {
            this.Reset()
            this.SetPosition(event.pageX, event.pageY)
            this.visaible = true
        },

        Hide() {
            this.Reset()
        },

        SetPosition(x: number, y: number) {
            this.offsetX = x
            this.offsetY = y
        }
    }
})

export { useContextMenuStore }
