const Joi = require('joi')

const loginValidation = (data) => {
    const schema = Joi.object({

        email: Joi.string().trim().allow(''),
        password: Joi.string().min(6).required().messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters'
        })
    })

    return schema.validate(data)
}


module.exports = { loginValidation }