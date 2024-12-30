import { defineStore } from 'pinia'

const useStore = defineStore('global', {
    state: () => ({
        page: {
            current: 1,
            total: 1,
            limit: 147
        },
        currentCategory: 0,
        containerElement: null as HTMLElement | null,
        loading: true,
        isLogin: false
    }),
    getters: {},
    actions: {
        $Init() {
            this.page.current = 1
            this.page.total = 1
            this.page.limit = 147
            this.loading = false
        },

        UpdateTotal(total: number) {
            this.page.total =  Math.ceil(total / this.page.limit)
        },

        SetLoading(status: boolean): void {
            this.loading = status
        }
    }
})

export { useStore }
