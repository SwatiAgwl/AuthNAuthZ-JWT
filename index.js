const express= require("express");
const app= express();

require('dotenv').config();

// middleware
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());


// routes
const routes= require('./routes/auth')
app.use('/api/v1', routes);

// db conn
const dbConnect= require('./config/database');
dbConnect();

app.listen(process.env.port, ()=>{
    console.log(`app started at port no. ${process.env.port}`)
})

app.get('/', (req,res)=>{
    res.send('hello');
})