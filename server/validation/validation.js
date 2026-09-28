import Joi from "joi";

export const registerSchema = Joi.object({
    fullName: Joi.string().trim().min(4).max(45).required().messages({
        'string.empty' : 'Name is required',
        'string.min': 'Name should be at least 4 characters long',
    }),

    email: Joi.string().trim().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email format',
    }),

    password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&#]{8,}$/).required().messages({
        'string.empty': 'Password is required',
        'string.pattern.base':
        'Password must be at least 8 characters long and include both letters and numbers',
    }),

    bio : Joi.string().max(150).optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});