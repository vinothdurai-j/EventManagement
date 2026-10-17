const express =require('express')

const router=express.Router()

router.use('/V1/admin',require('../models/V1/admin/routes/index'))
router.use('/V1/user',require('../models/V1/user/routes/index'))
router.use('/V1/event',require('../models/V1/event/routes/index'))
router.use('/V1/eventRegister',require('../models/V1/registration/routes/index'))
module.exports=router