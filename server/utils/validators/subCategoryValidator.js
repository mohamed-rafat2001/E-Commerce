import { check, body } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware.js';
import slugify from 'slugify';

export const getSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid SubCategory id format'),
  validatorMiddleware,
];

export const createSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('SubCategory required')
    .isLength({ min: 2 })
    .withMessage('Too short SubCategory name')
    .isLength({ max: 32 })
    .withMessage('Too long SubCategory name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('category')
    .notEmpty()
    .withMessage('subCategory must be belong to category')
    .isMongoId()
    .withMessage('Invalid Category id format'),
  validatorMiddleware,
];

export const updateSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid SubCategory id format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

export const deleteSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid SubCategory id format'),
  validatorMiddleware,
];
