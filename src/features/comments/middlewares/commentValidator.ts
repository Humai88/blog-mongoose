import { body, query, param } from 'express-validator';
import { inputErrors } from '../../../global/middlewares/inputErrors';
import {  SortDirection } from 'mongodb';
import { authMiddleware } from '../../../global/middlewares/authMiddleware';
import { validateObjectId } from '../../posts/middlewares/postValidator';

export const commentValidator = [
  authMiddleware,
  body('content').trim().isLength({ min: 20, max: 300 }).withMessage('Comment must be between 20 and 300 characters'),
  inputErrors
];

export const commentIdParamValidator = [
  validateObjectId('commentId'),
  param('commentId')
    .notEmpty()
    .withMessage('Comment ID is required')

];

export const commentQueryValidator = [
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