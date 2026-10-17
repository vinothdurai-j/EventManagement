const userService = require('../service/index')

const {registerSchema,loginSchema} = require('../validation')

module.exports.register=async(req,res)=>{

    try{
const {error}=registerSchema.validate(req.body)

if(error){
    return  res.status(400).json({
        message:error.details[0].message
    })
}

        const data = await userService.registerUser(req.body)
        return res.status(201).json({
            message:"User Register Successful",
            data:data
        })
    }
    catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({
        success: false,
        message: error.status
            ? error.message
            : "Internal Server Error"
    });
}
}

module.exports.loginUser= async(req,res)=>{

    try{
        const {error}= loginSchema.validate(req.body)

        if(error){
        return res.status(400).json({
            message:error.details[0].message
        })
        }

        const {email,password}= req.body
const data = await userService.loginUser({email,password})

return res.status(200).json({
    message:"Login Successful",
    data:data
})
    }catch(error){
        console.error(error)
         return res.status(error.statusCode || 500).json({

            message: error.statusCode ? error.message : 'Internal Server Error😑',
        })
    }

}


module.exports.getProfile = async (req, res) => {
    try {
        const data = await userService.getProfile(req.user.id)

        return res.status(200).json({
            message: "Profile Fetched Successfully",
            data: data
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : 'Internal Server Error'
        })
    }
}