import { body, query } from 'express-validator';
import { inputErrors } from '../../../global/middlewares/inputErrors';
import { adminMiddleware } from '../../../global/middlewares/adminMiddleware';
import { SortDirection } from 'mongodb';

export const blogValidator = [
  adminMiddleware,
  body('name').isString().withMessage('Name must be a string').trim().isLength({ min: 1, max: 15 }).withMessage('Name must be between 1 and 15 characters'),
  body('description').isString().withMessage('Description must be a string').trim().isLength({ min: 1, max: 500 }).withMessage('Description must be between 1 and 500 characters'),
  body('websiteUrl').isString().trim().isLength({ min: 1, max: 100 }).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('Invalid URL format'),
  inputErrors
];

export const blogQueryValidator = [
  query('pageNumber')
    .isInt({ min: 1 })
    .toInt()
    .withMessage('Page number must be a positive integer'),
  
  query('pageSize')
    .isInt({ min: 1 }) 
    .toInt()
    .withMessage('Page size mmust be a positive integer'),
  
  query('sortBy')
    .isString()
    .isIn(['createdAt', 'name', 'id', 'description', 'websiteUrl'])
    .withMessage('Invalid sort field'),
  
  query('sortDirection')
    .isIn(['asc', 'desc'] as SortDirection[])
    .withMessage('Sort direction must be either "asc" or "desc"'),
  
  query('searchNameTerm')
    .isString()
    .withMessage('Search term must be a string'),

    inputErrors
];