import { check } from 'express-validator'
import type { Schema } from './public'

const validateIndexes = check('indexes').notEmpty().isArray().withMessage('"indexes" must be an array of numbers')

const validateCategory = check('categoty')
    .isInt({ min: 0 })
    .withMessage('"category" must be greater than or equal to 0')

export const PhotoSchema: Schema = {
    '/delete': [validateIndexes],

    '/list': [
        validateCategory,
        check('limit').isInt({ min: 10, max: 300 }).withMessage('"limit" must be between 10 and 50'),
        check('page').isInt({ min: 1 }).withMessage('"page" must be greater than or equal to 1')
    ],

    '/change-category': [validateIndexes, validateCategory]
}
