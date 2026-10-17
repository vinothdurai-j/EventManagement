const Joi = require('joi')

module.exports.registerEventSchema = Joi.object({
    eventId: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid Event Id',
        'string.length': 'Invalid Event Id',
        'string.empty': 'Event Id Is Required',
        'any.required': 'Event Id Is Required'
    })
})