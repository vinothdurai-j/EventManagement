const mongoose =require('mongoose')
const { type } = require('node:os')

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true

    },
    password:{
        type:String,
        require:true,
        select:false
    },
    phone:{
        type:String,
        trim:true
    },
    role:{
        type:String,
        default:'user'
    }
},
{
    timestamps:true
}
)

module.exports=mongoose.model('User',userSchema)