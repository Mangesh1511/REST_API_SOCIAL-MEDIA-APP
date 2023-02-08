const router=require('express').Router();
const User=require('../models/user');
const bcrypt=require('bcrypt')

//REGISTER
router.post('/register',async(req,res)=>{
  
 
 try{
    const salt=await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(req.body.password,salt);
    //Create New User
    const user=new User({
        username:req.body.username,
        email:req.body.email,
        password:hashPassword
     });
     //Save New User and return response
    const person=await user.save();
    res.status(200).json(person);
 }
 catch(err){
    console.log(err);
 }
 
})



//LOGIN
router.post("/login",async (req,res)=>{
    try{
    const user=await User.findOne({email:req.body.email});
        if(!user)res.status(404).json("user not found");

        const Validpassword=await bcrypt.compare(req.body.password,user.password)
        if(!Validpassword) res.status(400).json('Wrong password !!')

        else res.status(200).json(user);

    }catch(err)
    {
        console.log(err);
    }
});
module.exports=router
