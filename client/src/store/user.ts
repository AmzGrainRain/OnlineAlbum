import { defineStore } from 'pinia'
import { UserT } from '../model'

import { Login } from '../api/auth/login'
import { Logout } from '../api/auth/logout'
import { IsAuthenticated } from '../api/auth'

const useUserStore = defineStore('user', {
    state: () => ({
        user: null as UserT | null
    }),
    getters: {},
    actions: {
        GetUser(): UserT | null {
            return this.user
        },

        async IsLogin(): Promise<boolean> {
            if (this.user === null) return false

            try {
                const resp = await IsAuthenticated()
                this.user = resp.data
                return true
            } catch (e) {
                console.error(e)
                return false
            }
        },

        async Login(email: string, password: string): Promise<boolean> {
            try {
                const resp = await Login(email, password)
                this.user = resp.data
                return true
            } catch (e) {
                console.error(e)
                return false
            }
        },

        IsAdmin(): boolean {
            if (this.user === null) return false
            return this.user.is_admin
        },

        async Logout() {
            try {
                this.user = null
                await Logout()
                location.href = '/'
            } catch (e) {
                console.error(e)
            }
        }
    }
})

export { useUserStore }
