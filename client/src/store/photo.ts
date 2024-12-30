import { defineStore } from 'pinia'
import { PhotoT, UserT } from '../model'

import type { CatrgoryT } from '../api/types'
import { ListCategory } from '../api/category'

const usePhotoStore = defineStore('photo', {
    state: () => ({
        photos: [] as PhotoT[],
        categories: [] as CatrgoryT[],
        currentRightClick: null as PhotoT | null,
        selection: {
            enabled: false,
            selected: new Map<number, PhotoT>()
        }
    }),
    getters: {},
    actions: {
        Get(index: number) {
            if (index < 0 || index >= this.photos.length) {
                return null
            }

            return this.photos[index]
        },

        ResetSelection(): void {
            this.currentRightClick = null
            this.selection.enabled = false
            this.selection.selected.clear()
        },

        async FetchCategories(): Promise<boolean> {
            try {
                const resp = await ListCategory()
                this.categories = resp.data
                return true
            } catch (e) {
                console.error(e)
                return false
            }
        },

        GetCurrentRightClick(): PhotoT | null {
            return this.currentRightClick
        },

        SetCurrentRightClick(photo: PhotoT | null) {
            this.currentRightClick = photo
        },

        ToggleMultipleChoice(status?: boolean): void {
            if (status === undefined) {
                this.selection.enabled = !this.selection.enabled
                return
            }

            this.selection.enabled = status
        },

        GetCurrentSelected(): PhotoT[] {
            return Array.from(this.selection.selected.values())
        },

        GetPath(user: UserT | null, photo: PhotoT): string {
            return user ? `/photos/${user.id}/${photo.file_name}` : ''
        },

        GetThumbnailPath(user: UserT | null, photo: PhotoT): string {
            return user ? `/photos/${user.id}/thumbnails/${photo.file_name}` : ''
        },

        GetURL(user: UserT | null, photo: PhotoT): string {
            return `${window.location.protocol}//${window.location.host}${this.GetPath(user, photo)}`
        },

        async Download(user: UserT | null, photos: PhotoT[]) {
            for (const photo of photos) {
                try {
                    const resp = await fetch(this.GetPath(user, photo))
                    const blob = await resp.blob()
                    const url = URL.createObjectURL(blob)

                    const a = document.createElement('a')
                    a.href = url
                    a.download = photo.file_name
                    a.click()

                    URL.revokeObjectURL(url)
                    a.remove()
                } catch (e) {
                    console.error(e)
                }
            }
        },

        AddToSelected(photo: PhotoT[]): void {
            if (!this.selection.enabled) {
                return
            }

            for (const p of photo) {
                this.selection.selected.set(p.id, p)
            }
        },

        RemoveSelected(photo: PhotoT[]): void {
            if (!this.selection.enabled) {
                return
            }

            for (const p of photo) {
                this.selection.selected.delete(p.id)
            }
        },

        Add(photo: PhotoT): void {
            this.photos.push(photo)
        },

        Remove(photos: PhotoT[]): void {
            for (const photo of photos) {
                const i = this.photos.findIndex((p) => p.id === photo.id)
                if (i !== -1) {
                    this.photos.splice(i, 1)
                }
            }
        }
    }
})

export { usePhotoStore }
