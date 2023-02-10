const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt')

//update a user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);

      } catch (err) {
        console.log('here2\n');
        return res.status(500).json(err);
      }

      try {
        const person = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        console.log("here3\n");
        res.status(200).json(person);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    }
  }
  else
    res.status(403).json('You can only update your own account!!')
})
//delete a user

router.delete("/:id", async (req, res) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    try {

      try
      {
        const person=await User.findById(req.body.userId);
        if(person!=null||person!=undefined)
        console.log('person found');
        else 
        res.status(404).json('User not Found');

      }catch(err)
      {
        res.status(404).send('User not found');
      }
      
      
      const user = await User.findByIdAndDelete(req.body.userId);

      res.status(200).json('User Successfully removed from the database');
    } catch (err) {
      console.log(err);
      res.status(500).json('User not found');
    }

  }
  else {
    res.status(400).json('You can delete your account only');
  }
})
//find one user
router.get('/:id',async (req,res)=>{
  try
  {
    const person=await User.findById(req.body.userId);
    const {password,updatedAt,...other}=person._doc;
    if(person!=null||person!=undefined)
    res.status(200).json(other);
    else 
    res.status(404).json('User not Found');

  }catch(err)
  {
    res.status(404).send('User not found');
  }


  })
//follow a user 
router.put('/:id/follow',async(req,res)=>{
  if(req.body.userId!==req.params.id)
  {
    try{

      const user=await User.findById(req.params.id);
      if(user==null||user===undefined)
      {
        console.log(err);
        res.status(404).json('user not found');
      }
      const currentuser=await User.findById(req.body.userId);
      if(currentuser==null||currentuser==undefined)
      {
        console.log(err);
        res.status(404).json('please register with us !');
      }
      if(!user.followers.includes(req.body.userId))
      {
        await user.updateOne({$push:{followers:req.body.userId}});
        await currentuser.updateOne({$push:{following:req.params.id}});
        res.status(200).json(user);
      }
      else
      {
        res.status(403).json('User already followed');
      }
    }
    catch(err)
    {
      console.log(err);
      res.status(500).json(err);
    }
  }
  else
  {
    res.status(403).json('You cannot follow yourself');
  }
})
//unfollow a user
router.put('/:id/unfollow',async(req,res)=>{
  if(req.body.userId!==req.params.id)
  {
    try{

      const user=await User.findById(req.params.id);
      console.log('here1\n');
      if(user==null||user===undefined)
      {
        console.log(err);
        res.status(404).json('user not found');
      }
      const currentuser=await User.findById(req.body.userId);
      console.log('here1\n');
      if(currentuser==null||currentuser==undefined)
      {
        // console.log(err);
        res.status(404).json('please register with us !');
      }
      else if(currentuser.following.includes(req.params.id))
      {
        await currentuser.updateOne({$pull:{following:req.params.id}});
        await user.updateOne({$pull:{followers:req.body.userId}});
        res.status(200).json('unfollowed successfully');
      }
      else
      {
        res.status(403).json('You are not following him ');
      }
    }
    catch(err)
    {
      console.log(err);
      res.status(500).json(err);
    }
  }
  else
  {
    res.status(403).json('You cannot unfollow yourself');
  }
})
//get all user



router.get('/', (req, res) => {
  res.status(200).send(`Welcome to routes!!`);
})

module.exports = router
