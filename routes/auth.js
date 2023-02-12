const router = require('express').Router();
const User = require('../models/user');
const {register,login}=require('../controllers/userController')
const bcrypt = require('bcrypt')

//REGISTER
router.post('/register', register);
//LOGIN
router.post("/login", login);
module.exports = router
