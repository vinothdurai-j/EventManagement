const adminService = require('../service/index')

const { loginValidation } = require('../validation')

module.exports.login = async (req, res) => {

    try {

        const {error}= loginValidation(req.body)

        if(error){
            return res.status(400).json({
                message:error.details[0].message
            })
        }
        const { email, password } = req.body

      
        const data = await adminService.login({ email, password })

        return res.status(200).json({
            message: "Login Successfull",
            data: data
        })

    } catch (error) {
        return res.status(error.statusCode || 500).json({

            message: error.statusCode ? error.message : 'Internal Server Error😂',
        })
    }

}