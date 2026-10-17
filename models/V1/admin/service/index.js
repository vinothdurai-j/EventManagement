const bcrypt = require('bcrypt')

const  admin  = require('../model/index') 

const {generateToken}=require('../../../../utilis/token')

module.exports.createDefalutAdmin = async () => {
    try {
        const adminCount = await admin.countDocuments()
        if (adminCount > 0) return

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)

        await admin.create({
            name: process.env.ADMIN_NAME || 'Super Admin',
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
        })

        console.log('Default admin created:', process.env.ADMIN_EMAIL)
    } catch (error) {
        console.log('Admin seed failed:', error.message)
    }
}

module.exports.login = async ({ email, password }) => {
    try {
        const user = await admin.findOne({ email }).select('+password')

        if (!user) {
            const error = new Error('User not found')
            error.statusCode = 404
            throw error
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            const error = new Error('Invalid password')
            error.statusCode = 401
            throw error
        }

        const token = generateToken({
            id: user._id,
            role: user.role
        })

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }

    } catch (error) {
        console.error(error.message)
        throw error        
    }
}