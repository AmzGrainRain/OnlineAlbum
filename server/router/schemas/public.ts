import { check } from 'express-validator'

export type Schema = {
    [key: string]: any
}

const validateEmail = check('email').notEmpty().isEmail().withMessage('Email is required')

const validatePassword = check('password')
    .notEmpty()
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password is required and should be at least 8 characters long')

const validateId = check('id').notEmpty().isInt().withMessage('ID is required and should be an integer')

const validateName = check('name')
    .notEmpty()
    .isString()
    .isLength({ min: 1 })
    .withMessage('Name is required and should be at least 1 character long')

export {
    validateEmail,
    validatePassword,
    validateId,
    validateName
}
