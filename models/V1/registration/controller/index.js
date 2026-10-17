const registrationService = require('../service/index')
const { registerEventSchema } = require('../validation')

module.exports.registration = async (req, res) => {
    try {
        const { error } = registerEventSchema.validate(req.body)

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        const data = await registrationService.registerForEvent(req.user.id, req.body.eventId)

        return res.status(201).json({
            message: "Registered Successfully",
            data: data
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : 'Internal Server Error'
        })
    }
}


module.exports.getMyRegistrations = async (req, res) => {
    try {
        const data = await registrationService.getMyRegistrations(req.user.id)

        if (data.length === 0) {
            return res.status(200).json({
                message: "No Registrations Found",
                data: []
            })
        }

        return res.status(200).json({
            message: "Registrations Fetched Successfully",
            data: data
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : 'Internal Server Error'
        })
    }
}



module.exports.cancelRegistration = async (req, res) => {
    try {
        const data = await registrationService.cancelRegistration(req.user.id, req.params.id)

        return res.status(200).json({
            message: "Registration Cancelled Successfully",
            data: data
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : 'Internal Server Error'
        })
    }
}


module.exports.getEventRegistrations = async (req, res) => {
    try {
        const data = await registrationService.getEventRegistrations(req.params.eventId, req.query)

        return res.status(200).json({
            message: "Event Registrations Fetched Successfully",
            data: data
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : 'Internal Server Error'
        })
    }
}