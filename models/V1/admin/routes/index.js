const controller =require('../controller/index')
const express=require('express')
const router=express.Router()

const {authenticate}=require('../../../../middilware/auth')

router.post('/login',controller.login)



module.exports=router