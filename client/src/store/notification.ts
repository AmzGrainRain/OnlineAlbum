import { defineStore } from 'pinia'

enum NotificationType {
    SUCCESS = '#00b89455',
    ERROR = '#ff572255',
    INFO = '#2196f355',
    WARNING = '#ffc10755'
}

interface Notification {
    message: string,
    type: NotificationType,
    timestamp: number
}

const useNotificationStore = defineStore('notification', {
    state: () => ({
        list: [] as Notification[],
        delay_ms: 5000
    }),
    getters: {},
    actions: {
        Remove(ts: number) {
            this.list.splice(this.list.findIndex(n => n.timestamp === ts), 1)
        },

        New(message: string, type: NotificationType = NotificationType.INFO, delay_ms?: number) {
            const ts = Date.now()
            this.list.unshift({message, type, timestamp: ts})
            setTimeout(() => {
                this.Remove(ts)
            }, delay_ms || this.delay_ms)
        },

        Clear() {
            this.list.length = 0
        }
    }
})

export type { Notification }
export { useNotificationStore, NotificationType }
