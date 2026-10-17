const controller = require('../controller/index')
const express = require('express')
const router =express.Router()
const {authenticate,isAdmin, isUser} =require('../../../../middilware/auth')


router.post('/register',authenticate,isUser,controller.registration)
router.get('/getMyRegistrations',authenticate,isUser,controller.getMyRegistrations)
router.patch('/cancelRegistration/:id',authenticate,isUser,controller.cancelRegistration)




router.get('/getEventRegistrations/:eventId',authenticate,isAdmin,controller.getEventRegistrations)



module.exports=router