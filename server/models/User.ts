interface User {
    id: number
    name: string
    email: string
    is_admin: number
    created_at: number
}

interface AdminUser {
    name: string
    email: string
    password: string
    createdAt: number
}

export type { User, AdminUser }
