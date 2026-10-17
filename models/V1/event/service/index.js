const event = require('../model/index')
const mongoose= require('mongoose')

module.exports.createEvent = async (data, adminId) => {
    try {
        const { name, description, category, location, eventDate, maxParticipants } = data

        const newEvent = await event.create({
            name,
            description,
            category,
            location,
            eventDate,
            maxParticipants,
            createdBy: adminId
        })

        return newEvent

    } catch (error) {
        console.error(error.message)
        throw error
    }
}

module.exports.getAllEventsForAdmin = async () => {
    try {
        const events = await event.find().sort({ createdAt: -1 })

        return events

    } catch (error) {
        console.error(error.message)
        throw error
    }
}

module.exports.updateEvent = async (eventId, data) => {
    try {
        const { name, description, category, location, eventDate, maxParticipants, status } = data

        const updatedEvent = await event.findByIdAndUpdate(
            eventId,
            { name, description, category, location, eventDate, maxParticipants, status },
            { new: true, runValidators: true }
        )

        if (!updatedEvent) {
            const error = new Error('Event Not Found')
            error.statusCode = 404
            throw error
        }

        return updatedEvent

    } catch (error) {
        console.error(error.message)
        throw error
    }
}


module.exports.updateEventStatus = async (eventId, status) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            const error = new Error('Invalid Event Id')
            error.statusCode = 400
            throw error
        }

        const updatedEvent = await event.findByIdAndUpdate(
            eventId,
            { status },
            { new: true, runValidators: true }
        )

        if (!updatedEvent) {
            const error = new Error('Event Not Found')
            error.statusCode = 404
            throw error
        }

        return updatedEvent

    } catch (error) {
        console.error(error.message)
        throw error
    }
}


// module.exports.deleteEvent = async (eventId) => {
//     try {
//         const foundEvent = await event.findById(eventId)

//         if (!foundEvent) {
//             const error = new Error('Event Not Found')
//             error.statusCode = 404
//             throw error
//         }

//         await foundEvent.deleteOne()
//         await Registration.deleteMany({ event: eventId })

//     } catch (error) {
//         if (error.name === 'CastError' && error.path === '_id') {
//             error.message = 'Invalid Event Id'
//             error.statusCode = 400
//         }
//         console.error(error.message)
//         throw error
//     }
// }
module.exports.deleteEvent = async (eventId) => {
    try {
        const foundEvent = await event.findById(eventId)

        if (!foundEvent) {
            const error = new Error('Event Not Found')
            error.statusCode = 404
            throw error
        }

        await foundEvent.deleteOne()

    } catch (error) {
        if (error.name === 'CastError' && error.path === '_id') {
            error.message = 'Invalid Event Id'
            error.statusCode = 400
        }
        console.error(error.message)
        throw error
    }
}


//User Section
module.exports.getActiveEvents = async (query) => {
    try {
        const filter = {
            status: 'ACTIVE',
            eventDate: { $gte: new Date() }
        }

        if (query.category) {
            filter.category = query.category
        }

        if (query.location) {
            filter.location = query.location
        }

        const events = await event.find(filter).sort({ eventDate: 1 })

        return events

    } catch (error) {
        console.error(error.message)
        throw error
    }
}



// Admin can open any event, user can open only ACTIVE events
module.exports.getEventById = async (eventId, role) => {
    try {
        const foundEvent = await event.findById(eventId)

        if (!foundEvent) {
            const error = new Error('Event Not Found')
            error.statusCode = 404
            throw error
        }

        if (role !== 'admin' && foundEvent.status !== 'ACTIVE') {
            const error = new Error('Event Not Found')
            error.statusCode = 404
            throw error
        }

        return foundEvent

    } catch (error) {
        if (error.name === 'CastError' && error.path === '_id') {
            error.message = 'Invalid Event Id'
            error.statusCode = 400
        }
        console.error(error.message)
        throw error
    }
}