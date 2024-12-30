import type { Schema } from './public'
import { validateId, validateName } from './public'

export const CategorySchema: Schema = {
    '/add': [validateName],
    '/delete': [validateId],
    '/rename': [validateId, validateName]
}
