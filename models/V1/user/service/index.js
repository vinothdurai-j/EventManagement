const bcrypt = require('bcrypt')

const User =require('../model/index')
const {generateToken} =require('../../../../utilis/token');

module.exports.registerUser= async(data)=>{

    try{
        const email =data.email.toLowerCase();
        const existingUser =await User.findOne({email})
        if (existingUser) {
            const error = new Error("Email already registered");
            error.status = 409;
            throw error;
        }
        const hashedPassword = await bcrypt.hash(data.password,10)
        const user  = await User.create({
            name:data.name,
            email,
            password:hashedPassword,
            phone:data.phone
           
        })

        // const token = generateToken ({
        //     id:user._id,
        //     role:"user"
        // })

        return {
            // token,
                user: { id: user._id,
                     name: user.name,
                      email: user.email, 
                      phone:user.phone,
                       role: 'user' }
    }
}catch(error){
throw error
}
}


module.exports.loginUser = async ({ email, password }) => {
    try {
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            const error = new Error('User Not Found')
            error.statusCode = 404
            throw error
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            const error = new Error('Invalid Password')
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
module.exports.getProfile = async (userId) => {
    try {
        const foundUser = await User.findById(userId)

        if (!foundUser) {
            const error = new Error('User Not Found')
            error.statusCode = 404
            throw error
        }

        return foundUser

    } catch (error) {
        if (error.name === 'CastError' && error.path === '_id') {
            error.message = 'Invalid User Id'
            error.statusCode = 400
        }
        console.error(error.message)
        throw error
    }
}