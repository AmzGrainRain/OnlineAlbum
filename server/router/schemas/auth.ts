import type { Schema } from './public'
import { validateId, validateEmail, validatePassword, validateName } from './public'

export const AuthSchema: Schema = {
    '/list': [],
    '/login': [validateEmail, validatePassword],
    '/regist': [validateName, validateEmail, validatePassword],
    '/rename': [validateId, validateName],
    '/delete': [validateId],
};
