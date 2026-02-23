import { check, body } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import UserModel from "../../models/UserModel.js";
import bcrypt from "bcryptjs";

export const signupValidator = [
  check("firstName")
    .notEmpty()
    .withMessage("First name required")
    .isLength({ min: 3 })
    .withMessage("Too short first name"),
  check("lastName")
    .notEmpty()
    .withMessage("Last name required")
    .isLength({ min: 3 })
    .withMessage("Too short last name"),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation required"),
  check("phoneNumber")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  validatorMiddleware,
];

export const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),
  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validatorMiddleware,
];
