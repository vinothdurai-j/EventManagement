const eventService = require('../service/index')
const { createEventSchema ,updateEventSchema,updateEventStatusSchema} = require('../validation')

module.exports.createEvent = async (req, res) => {
    try {
        const { error } = createEventSchema.validate(req.body)

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        const data = await eventService.createEvent(req.body, req.user.id)

        
        console.log(data)

        return res.status(201).json({
            message: "Event Created Successfully",
            data: data
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : 'Internal Server Error'
        })
    }
}


module.exports.getAllEventsForAdmin = async (req, res) => {
    try {
        const data = await eventService.getAllEventsForAdmin()

            if (!data || data.length === 0) {
            return res.status(404).json({
                message: "Events not found"
            })
        }

        return res.status(200).json({
            message: "Events Fetched Successfully",
            data: data
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : 'Internal Server Error'
        })
    }
}


module.exports.updateEvent = async (req, res) => {
    try {
        const { error } = updateEventSchema.validate(req.body)

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        const data = await eventService.updateEvent(req.params.id, req.body)

        return res.status(200).json({
            message: "Event Updated Successfully",
            data: data
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : 'Internal Server Error'
        })
    }
}


module.exports.updateEventStatus = async (req, res) => {
    try {
        const { error } = updateEventStatusSchema.validate(req.body)

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        const data = await eventService.updateEventStatus(req.params.id, req.body.status)

        return res.status(200).json({
            message: `Event ${req.body.status === 'ACTIVE' ? 'Activated' : 'Deactivated'} Successfully`,
            data: data
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : 'Internal Server Error'
        })
    }
}


module.exports.deleteEvent = async (req, res) => {
    try {
        await eventService.deleteEvent(req.params.id)

        return res.status(200).json({
            message: "Event Deleted Successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : 'Internal Server Error'
        })
    }
}


//User Section
module.exports.getActiveEvents = async (req, res) => {
    try {
        const data = await eventService.getActiveEvents(req.query)

    if (data.length === 0) {
            return res.status(200).json({
                message: "No Events Found",
                data: []
            })
        }

        return res.status(200).json({
            message: "Events Fetched Successfully👁️",
            data: data
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : 'Internal Server Error'
        })
    }
}



module.exports.getEventById = async (req, res) => {
    try {
        const data = await eventService.getEventById(req.params.id, req.user.role)

        return res.status(200).json({
            message: "Event Fetched Successfully",
            data: data
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : 'Internal Server Error'
        })
    }
}