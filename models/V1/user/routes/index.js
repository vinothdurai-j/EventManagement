const express = require('express')
const controller =require('../controller/index')
const router =express.Router()
const {authenticate,isAdmin, isUser} =require('../../../../middilware/auth')

router.post('/register',controller.register)
router.post('/login',controller.loginUser)
router.get('/getProfile',authenticate,isUser,controller.getProfile)


module.exports=router