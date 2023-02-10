const router=require('express').Router()
const Post=require('../models/post')
const bcrypt = require('bcrypt')
//create a post 
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      res.status(500).json(err);
    }
  });
//update a post 
router.put("/:id", async (req, res) => {
    try {
        // console.log(req.params.id);
      const post = await Post.findById(req.params.id);
    //   res.json(post);
      if (post.userId === req.body.userId) {
        await post.updateOne({ $set: req.body });
        res.status(200).json("the post has been updated");
      } else {
        res.status(403).json("you can update only your post");
      }
    } catch (err) {
        console.log(err);
      res.status(500).json(err);
    }
  });
//delete a post 
router.delete("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.deleteOne();
        res.status(200).json("the post has been deleted");
      } else {
        res.status(403).json("you can delete only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });
//Search a Post
router.get("/:id",async(req,res)=>{
  try{
    const post=await Post.findById(req.params.id);
    if(post!==null)
    res.status(200).json(post);
    else res.status(404).json('No such post here\n');
  }
  catch(err)
  {
    console.log(err);
    res.status(403).json('No Posts Found');
  }
})  
//like a post
router.put("/:id/like", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      console.log(post);
      if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json("The post has been liked");
      } else {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json("The post has been disliked");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });
  //add a comment
 router.put('/:id/comment',async(req,res)=>{
    try
    {
      console.log(req.params.id);
        const post = await Post.findById(req.params.id); 

        console.log(post);       
        await post.updateOne({$push:{comments:req.body.comment}});
        res.status(200).json('Your comment has been added');

    }catch(err)
    {
        console.log(err);
        res.status(404).json('error os something vague');
    }
    
 })

//get all post
router.get("/timeline/all", async (req, res) => {
    try {
      const currentUser = await User.findById(req.body.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      res.json(userPosts.concat(...friendPosts))
    } catch (err) {
        console.log(err);
      res.status(500).json(err);
    }
  });

module.exports=router;