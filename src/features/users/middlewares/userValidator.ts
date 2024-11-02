import { body, query } from 'express-validator';
import { inputErrors } from '../../../global/middlewares/inputErrors';
import { adminMiddleware } from '../../../global/middlewares/adminMiddleware';
import { SortDirection } from 'mongodb';

export const userValidator = [
  body('login').trim().isLength({ min: 3, max: 10 }).withMessage('Login must be between 3 and 10 characters').matches(/^[a-zA-Z0-9_-]*$/).withMessage('Invalid login format'),
  body('password').trim().isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 and 20 characters'),
  body('email').trim().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Invalid email format'),
  inputErrors
];

export const userConfirmationValidator = [
  body('code').isUUID().withMessage('Invalid confirmation code format'),
  inputErrors
];

export const passwordRecoveryValidator = [
  body('recoveryCode').isUUID().withMessage('Invalid confirmation code format'),
  body('newPassword').trim().isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 and 20 characters'),
  inputErrors
];


export const emailValidator = [
  body('email').trim().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Invalid email format'),
  inputErrors
];

export const userQueryValidator = [
  adminMiddleware,
  query('pageNumber')
    .isInt({ min: 1 })
    .toInt()
    .withMessage('Page number must be a positive integer'),
  
  query('pageSize')
    .isInt({ min: 1 }) 
    .toInt()
    .withMessage('Page size must be a positive integer'),
  
  query('sortBy')
    .isString()
    .isIn(['createdAt', 'login', 'id', 'email'])
    .withMessage('Invalid sort field'),
  
  query('sortDirection')
    .isIn(['asc', 'desc'] as SortDirection[])
    .withMessage('Sort direction must be either "asc" or "desc"'),

    inputErrors
];