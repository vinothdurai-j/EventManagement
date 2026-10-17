const Joi = require('joi')

module.exports.createEventSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    location: Joi.string().required(),
    eventDate: Joi.date().required(),
    maxParticipants: Joi.number().min(1).required()
})

module.exports.updateEventSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    category: Joi.string(),
    location: Joi.string(),
    eventDate: Joi.date(),
    maxParticipants: Joi.number().min(1),
    status: Joi.string().valid('ACTIVE', 'INACTIVE')
}).min(1)


module.exports.updateEventStatusSchema = Joi.object({
    status: Joi.string().valid('ACTIVE', 'INACTIVE').required()
})