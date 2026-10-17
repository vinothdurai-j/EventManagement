const {verifyToken}= require('../utilis/token')



module.exports.authenticate=(req,res,next)=>{

    const header =req.headers.authorization

    if(!header || !header.startsWith('Bearer')){
        return res.status(401).json({
            message:"Please Login First"
        })
    }
    try{
        req.user = verifyToken(header.split(' ')[1])
        next()
    }catch(error){
         console.log(error.message) 
        return res.status(401).json({
            message:"Invalid or expired token"
        })
    }
}

module.exports.isAdmin=(req,res,next)=>{
    if(req.user.role !=='admin'){
        return res.status(403).json({
            message:"Admin Accesss Only"
        })
    }
    next()
}

module.exports.isUser=(req,res,next)=>{
    if(req.user.role !=='user'){
        return res.status(403).json({
            message:"User Access Only"
        })
    }
    next()
}