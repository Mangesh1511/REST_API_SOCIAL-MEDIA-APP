require('./connection')

const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config()
const authRoute=require('./routes/auth')
const userRoute = require('./routes/users');
const postRoute=require('./routes/posts');
//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
const axios = require('axios')
app.use(express.static('views'));
app.set('view engine', 'ejs')

app.get('/',(req,res)=>{
    res.render('index',{username:"mangesh"});
})
app.use('/api/users', userRoute);
app.use('/api/auth',authRoute);
app.use('/api/posts',postRoute);

app.listen(5000, () => {
    console.log("App is listening at port 5000...");
});
