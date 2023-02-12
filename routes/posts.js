const router=require('express').Router()
const Post=require('../models/post')
const bcrypt = require('bcrypt');
const { CreatePost ,UpdatePost,DeletePost,likeDislikePost, CommentPost,SearchApost} = require('../controllers/postController');

//Create a post 
router.post("/", CreatePost);

//Update a post 
router.put("/", UpdatePost);

//Delete a post 
router.delete("/", DeletePost);

//Search a Post
router.get("/",SearchApost)  

//like a post
router.put("/like", likeDislikePost);

//add a comment
 router.put('/comment',CommentPost)



module.exports=router;