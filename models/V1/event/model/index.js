const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        eventDate: { type: Date, required: true },
        maxParticipants: { type: Number, required: true, min: 1 },
        registeredCount: { type: Number, default: 0 },
        status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
    },
    { timestamps: true }
)

eventSchema.virtual('availableSeats').get(function () {
    return this.maxParticipants - this.registeredCount
})

eventSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Event', eventSchema)