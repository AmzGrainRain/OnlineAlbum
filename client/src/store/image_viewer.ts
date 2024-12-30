import { defineStore } from 'pinia'
import { PhotoT } from '../model'

const useImageViewerStore = defineStore('imageViewer', {
    state: () => ({
        visible: false,
        photo: null as PhotoT | null
    }),
    getters: {},
    actions: {
        Show(photo: PhotoT) {
            this.photo = photo
            this.visible = true
        },

        Hide() {
            this.photo = null
            this.visible = false
        },
    }
})

export { useImageViewerStore }
