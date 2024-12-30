interface UserT {
    id: number
    name: string
    email: string
    is_admin: boolean
    created_at: number
}

interface PhotoT {
    id: number
    title: string
    description: string
    width: number
    height: number
    landscape: boolean
    category_id: string
    uploaded_at: number
    file_name: string
}

export type { UserT, PhotoT }
