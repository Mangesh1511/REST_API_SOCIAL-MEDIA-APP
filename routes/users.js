const router = require('express').Router();
const User = require('../models/user');
const {updateUser,deleteUser,searchUser,followUsers, unfollowUsers}=require('../controllers/userController')
const bcrypt = require('bcrypt')

//update a user
router.put("/",updateUser);

//delete a user
router.delete("/", deleteUser)

//find one user
router.get('/',searchUser)

//follow a user 
router.put('/follow',followUsers)

//unfollow a user
router.put('/unfollow',unfollowUsers)


module.exports = router
