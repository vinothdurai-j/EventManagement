const Joi = require('joi')

const registerSchema= Joi.object({
    name:Joi.string().trim().min(2).max(50).required(),
    email:Joi.string().email().required(),
    phone:Joi.string().trim().pattern(/^[0-9+\-\s]{7,15}$/).allow(''),
       password: Joi.string().min(6).required().messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 6 characters'
            })

})

const loginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(6).required()
});


module.exports={registerSchema,loginSchema}