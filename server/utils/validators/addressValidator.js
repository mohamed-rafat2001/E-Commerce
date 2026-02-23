import { check } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware.js';

export const addAddressValidator = [
  check('alias')
    .notEmpty()
    .withMessage('Alias required')
    .custom((val, { req }) => {
      // Check if alias already exists
      const user = req.user;
      const address = user.addresses.find((addr) => addr.alias === val);
      if (address) {
        throw new Error('You already have an address with this alias');
      }
      return true;
    }),
  check('details')
    .notEmpty()
    .withMessage('Details required')
    .isLength({ min: 10 })
    .withMessage('Too short address details'),
  check('phone')
    .notEmpty()
    .withMessage('Phone required')
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
  check('city').notEmpty().withMessage('City required'),
  check('postalCode')
    .notEmpty()
    .withMessage('Postal Code required')
    .isPostalCode('any')
    .withMessage('Invalid Postal Code'),
  validatorMiddleware,
];

export const removeAddressValidator = [
  check('addressId').isMongoId().withMessage('Invalid Address id format'),
  validatorMiddleware,
];
