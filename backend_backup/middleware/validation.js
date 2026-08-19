const Joi = require('joi');

const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters',
        'any.required': 'Password is required'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const scanSchema = Joi.object({
    user_id: Joi.string().required(),
    url: Joi.string().uri().required()
});

const vaultSchema = Joi.object({
    type: Joi.string().valid('password', 'note').required(),
    title: Joi.string().max(100).required(),
    username: Joi.string().max(100).optional(),
    password: Joi.string().max(200).optional(),
    url: Joi.string().uri().optional(),
    note: Joi.string().max(2000).optional()
});

module.exports = {
    validateRegister: (req, res, next) => {
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ msg: error.details[0].message });
        next();
    },
    validateLogin: (req, res, next) => {
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ msg: error.details[0].message });
        next();
    },
    validateScan: (req, res, next) => {
        const { error } = scanSchema.validate(req.body);
        if (error) return res.status(400).json({ msg: error.details[0].message });
        next();
    },
    validateVault: (req, res, next) => {
        const { error } = vaultSchema.validate(req.body);
        if (error) return res.status(400).json({ msg: error.details[0].message });
        next();
    }
};
