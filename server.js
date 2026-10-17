require('dotenv').config();

const express =require('express')
const cors =require('cors')

const router =require('./router/index')
const {db}= require('./config/db')
const {seedAdmin}= require('./utilis/seedAdmin')

const app =express()

app.use(express.json())
app.use(cors())


app.get('/',(req,res)=>{
    res.json({
        message:"Event Management API is Running"
    })
})

app.use('/api', router) 

app.use((req,res)=>{
    res.status(404).json({
        message:"Route Not Found"
    })
})

const PORT  =process.env.PORT || 8000

const startServer = async () => {
    try {
        await db();
        await seedAdmin();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
    }
};

startServer();

