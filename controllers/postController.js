// const bcrypt = require('bcrypt')
const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const CreatePost = async (req, res) => {

    const acc_token = req.cookies.token;
    if (acc_token != null && acc_token != undefined) {
        const data = jwt.verify(acc_token, process.env.SECRET_KEY);
        const userId = data.id;
        if (userId != null && userId != undefined) {
            if(userId==req.body.userId)
            {
                try {
                    const user = await User.findById(userId);
                    if (user != null && user != undefined) {
                        const newPost = new Post(req.body);
                        try {
                            const savedPost = await newPost.save();
                            res.status(200).json(savedPost);
                        } catch (err) {
                            res.status(500).json(err);
                        }
    
                    }
                    else {
                        res.status(404).json('PLease login or register to create a post!');
                    }
    
                }
                catch (err) {
                    res.status(404).json('PLease login or register to create a post!');
                }
            }
            else
            {
                res.status(500).json('You can post through your account only!!');
            }
           
        }

    }
    else {
        res.status(404).json("Please Register With us to Create a Post!");
    }

};


const UpdatePost=async(req,res)=>{
    const acc_token=req.cookies.token;
    if(acc_token!=null && acc_token!=undefined)
    {
        console.log('got the account token!!')
        const data = jwt.verify(acc_token, process.env.SECRET_KEY);
        const userId = data.id;
        if(userId!=null && userId!=undefined)
        {
            console.log('got the user id');
            try {
                // console.log(req.params.id);
                console.log('Post id is: ',req.body.id);
              const post = await Post.findById(req.body.id);
                if(post!=null && post!=undefined)
                {
                    if (post.userId === userId) {
                        await post.updateOne({ $set:{desc:req.body.desc}});
                        res.status(200).json("the post has been updated");
                      } else {
                        res.status(403).json("you can update only your post");
                      }
                }
                else
                res.status(403).json(' post was deleted!');
             
            } catch (err) {
                console.log(err);
              res.status(500).json(err);
            }
        }
        else
        {
            res.status(404).json('Unauthorized access!!');
        }
    }
    else
    {
        res.status(404).json('You cannot Update a post without having an account');
    }
}

const DeletePost=async(req,res)=>{
    const acc_token=req.cookies.token;
    if(acc_token!=null && acc_token!=undefined)
    {
        console.log('got the account token!!')
        const data = jwt.verify(acc_token, process.env.SECRET_KEY);
        const userId = data.id;
        if(userId!=null && userId!=undefined)
        {
            console.log('got the user id');
            try {
                // console.log(req.params.id);
                console.log('Post id is: ',req.body.id);
              const post = await Post.findById(req.body.id);
                if(post!=null && post!=undefined)
                {
                    if (post.userId === userId) {
                      
                        await post.deleteOne();
                        res.status(200).json("the post has been deleted");
                      } else {
                        res.status(403).json("you can delete only your post");
                      }
                }
                else
                res.status(403).json('No such post found!');
             
            } catch (err) {
                console.log(err);
              res.status(500).json(err);
            }
        }
        else
        {
            res.status(404).json('Unauthorized access!!');
        }
    }
    else
    {
        res.status(404).json('You cannot Delete a post without having an account');
    }

}

const likeDislikePost=async(req,res)=>{
    const acc_token=req.cookies.token;
    if(acc_token!=null && acc_token!=undefined)
    {
        const data = jwt.verify(acc_token, process.env.SECRET_KEY);
        const userId = data.id;
        if(userId!=null && userId!=undefined)
        {
            console.log('got the user id');

            try{
                console.log('Post id is: ',req.body.id);
              const post = await Post.findById(req.body.id);
                if(post!=null && post!=undefined)
                {
                    if (!post.likes.includes(userId)) {
                        await post.updateOne({ $push: { likes: userId } });
                        res.status(200).json("The post has been liked");
                      } else {
                        await post.updateOne({ $pull: { likes: userId } });
                        res.status(200).json("The post has been disliked");
                      }

                }
                else
                {
                    res.status(404).json('No such  post found!');
                }

            }
            catch(err){
                console.log(err);
                res.status(500).json(err);
            }

        }
        else
        {
            res.status(404).json('Unauthorized access!!');
        }
    }
    else
    {
        res.status(404).json('You cannot Like/Dislike a post without having an account');   
    }
}

const CommentPost=async(req,res)=>{
    const acc_token=req.cookies.token;
    if(acc_token!=null && acc_token!=undefined)
    {
        const data = jwt.verify(acc_token, process.env.SECRET_KEY);
        const userId = data.id;
        if(userId!=null && userId!=undefined)
        {
            try{
                console.log('Post id is: ',req.body.id);
              const post = await Post.findById(req.body.id);
                if(post!=null && post!=undefined)
                {
                    const getit={userId,comments};
                    await post.updateOne({$push:{comments:getit}});
                    res.status(200).json('Your comment has been added');

                }
                else
                {
                    res.status(404).json('No such  post found!');
                }

            }
            catch(err){
                console.log(err);
                res.status(500).json('No Such post found');
            }

        }
        else
        {
            res.status(404).json('Unauthorized access!!');
        }
    }
    else
    {
        res.status(404).json('You cannot Comment on a post without having an account');   
    }
}
const SearchApost=async(req,res)=>{

    const acc_token=req.cookies.token;
    if(acc_token!=null && acc_token!=undefined)
    {
        const data = jwt.verify(acc_token, process.env.SECRET_KEY);
        const userId = data.id;
        if(userId!=null && userId!=undefined)
        {
            try{
                const post=await Post.findById(req.body.id);
                if(post!==null)
                res.status(200).json(post);
                else res.status(404).json('No such post here\n');
              }
              catch(err)
              {
                console.log(err);
                res.status(403).json('No Posts Found');
              }
        }
        else
        {
            res.status(404).json('Unauthorized access!!');
        }
    }
    else
    {
        res.status(404).json('You cannot Comment on a post without having an account');   
    }

}
module.exports = { CreatePost,UpdatePost,DeletePost,likeDislikePost,CommentPost,SearchApost };