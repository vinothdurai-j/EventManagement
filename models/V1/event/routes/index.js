const controller = require('../controller/index')
const express = require('express')
const router =express.Router()
const {authenticate,isAdmin, isUser} =require('../../../../middilware/auth')

router.post('/createEvent',authenticate,isAdmin,controller.createEvent)
router.get('/getAllEventsForAdmin',authenticate,isAdmin,controller.getAllEventsForAdmin)
router.put('/updateEvent/:id',authenticate,isAdmin,controller.updateEvent)
router.patch('/updateEventStatus/:id',authenticate,isAdmin,controller.updateEventStatus)
router.delete('/deleteEvent/:id',authenticate,isAdmin,controller.deleteEvent)


//User
router.get('/getActiveEvents',authenticate,isUser,controller.getActiveEvents)

//Admin & User
router.get('/getEventById/:id',authenticate,controller.getEventById)



module.exports=router