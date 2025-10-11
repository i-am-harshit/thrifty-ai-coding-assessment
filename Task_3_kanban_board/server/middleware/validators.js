const { body } = require("express-validator");
const User = require("../models/user");

exports.signupValidator = [
  // Optional username: if provided, must be 3-30 chars and contain only letters, numbers, underscores
  body("username")
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters.")
    .matches(/^\w+$/)
    .withMessage("Username may contain only letters, numbers and underscores.")
    .custom((value) => {
      return User.findOne({ username: value }).then((userDoc) => {
        if (userDoc) return Promise.reject("Username already exists.");
      });
    }),
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) return Promise.reject("Email address already exists.");
      });
    })
    .normalizeEmail(),
  body("password").trim().isLength({ min: 5 }),
  body("firstName").trim().not().isEmpty(),
  body("lastName").trim().not().isEmpty(),
];
