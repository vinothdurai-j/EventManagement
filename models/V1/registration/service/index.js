const event = require('../../event/model/index')      
const registration = require('../model/index')
const mongoose = require('mongoose')


// Registration validation flow (same order as the task document)
module.exports.registerForEvent = async (userId, eventId) => {
    let seatTaken = false

    try {
        // 1. (User is already authenticated by the auth middleware)

        // 2. Event exists?
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            const error = new Error('Invalid Event Id')
            error.statusCode = 400
            throw error
        }

        const foundEvent = await event.findById(eventId)

        if (!foundEvent) {
            const error = new Error('Event Not Found')
            error.statusCode = 404
            throw error
        }

        // 3. Event is ACTIVE?
        if (foundEvent.status !== 'ACTIVE') {
            const error = new Error('This Event Is Not Active')
            error.statusCode = 400
            throw error
        }

        // 4. Event date passed?
        if (foundEvent.eventDate <= new Date()) {
            const error = new Error('Registration Closed. Event Date Has Already Passed')
            error.statusCode = 400
            throw error
        }

        // 5. Already registered?
        const existing = await registration.findOne({ event: eventId, user: userId })

        if (existing && existing.status === 'REGISTERED') {
            const error = new Error('You Have Already Registered For This Event')
            error.statusCode = 409
            throw error
        }

        // 6. Capacity available? (atomic: seat edukkum bodhe check)
        const updatedEvent = await event.findOneAndUpdate(
            { _id: eventId, registeredCount: { $lt: foundEvent.maxParticipants } },
            { $inc: { registeredCount: 1 } },
            { new: true }
        )

        if (!updatedEvent) {
            const error = new Error('Event Is Full')
            error.statusCode = 400
            throw error
        }

        seatTaken = true

        // 7. All checks passed -> create registration
        let newRegistration

        if (existing) {
            // user cancelled before and is registering again -> reuse the same row
            existing.status = 'REGISTERED'
            existing.registeredAt = new Date()
            existing.cancelledAt = undefined
            newRegistration = await existing.save()
        } else {
            newRegistration = await registration.create({ event: eventId, user: userId })
        }

        return newRegistration

    } catch (error) {
        
        if (seatTaken) {
            await event.updateOne(
                { _id: eventId, registeredCount: { $gt: 0 } },
                { $inc: { registeredCount: -1 } }
            )
        }

        if (error.name === 'CastError' && error.path === '_id') {
            error.message = 'Invalid Event Id'
            error.statusCode = 400
        }
        // unique index (event + user) violated -> double click / race condition
        if (error.code === 11000) {
            error.message = 'You Have Already Registered For This Event'
            error.statusCode = 409
        }
        console.error(error.message)
        throw error
    }
}



module.exports.getMyRegistrations = async (userId) => {
    try {
        const registrations = await registration.find({ user: userId })
            .populate('event', 'name description category location eventDate status')
            .sort({ createdAt: -1 })

        return registrations

    } catch (error) {
        console.error(error.message)
        throw error
    }
}


module.exports.cancelRegistration = async (userId, registrationId) => {
    try {
        // user can cancel only his own registration
        const foundRegistration = await registration.findOne({ _id: registrationId, user: userId })

        if (!foundRegistration) {
            const error = new Error('Registration Not Found')
            error.statusCode = 404
            throw error
        }

        if (foundRegistration.status === 'CANCELLED') {
            const error = new Error('Registration Is Already Cancelled')
            error.statusCode = 400
            throw error
        }

        const foundEvent = await event.findById(foundRegistration.event)

        if (foundEvent && foundEvent.eventDate <= new Date()) {
            const error = new Error('Cannot Cancel After The Event Date Has Passed')
            error.statusCode = 400
            throw error
        }

        foundRegistration.status = 'CANCELLED'
        foundRegistration.cancelledAt = new Date()
        await foundRegistration.save()

        // atomic seat release
        await event.updateOne(
            { _id: foundRegistration.event, registeredCount: { $gt: 0 } },
            { $inc: { registeredCount: -1 } }
        )

        return foundRegistration

    } catch (error) {
        if (error.name === 'CastError' && error.path === '_id') {
            error.message = 'Invalid Registration Id'
            error.statusCode = 400
        }
        console.error(error.message)
        throw error
    }
}

// Admin: see who registered for an event
module.exports.getEventRegistrations = async (eventId, query) => {
    try {
        const foundEvent = await event.findById(eventId)

        if (!foundEvent) {
            const error = new Error('Event Not Found')
            error.statusCode = 404
            throw error
        }

        const filter = { event: eventId }

        if (query.status) {
            if (!['REGISTERED', 'CANCELLED'].includes(query.status)) {
                const error = new Error('Invalid Status')
                error.statusCode = 400
                throw error
            }
            filter.status = query.status
        }

        const registrations = await registration.find(filter)
            .populate('user', 'name email phone')
            .sort({ registeredAt: -1 })

        return {
            event: {
                id: foundEvent._id,
                name: foundEvent.name,
                maxParticipants: foundEvent.maxParticipants,
                registeredCount: foundEvent.registeredCount
            },
            registrations
        }

    } catch (error) {
        if (error.name === 'CastError' && error.path === '_id') {
            error.message = 'Invalid Event Id'
            error.statusCode = 400
        }
        console.error(error.message)
        throw error
    }
}