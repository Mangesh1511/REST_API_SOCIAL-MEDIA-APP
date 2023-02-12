const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')




const register = async (req, res) => {

  try {
    try {
      const find = await User.findOne({ username: req.body.username });
      if (find == null) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        //Create New User
        const user = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashPassword
        });
        const person = await user.save();
        const token = jwt.sign({ id: person._id, email: req.body.email }, process.env.SECRET_KEY, { expiresIn: '1d' })
        res.status(200).cookie('token', token, { httpOnly: true }).json({ person, token: token });
      }
      else {
        res.status(403).json('already registered with us please login');
      }
    }
    catch (err) {
      console.log(err);
    }
    //Save New User and return response

  }
  catch (err) {
    console.log(err);
  }
}


const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user != null && user != undefined) {
      const Validpassword = await bcrypt.compare(req.body.password, user.password)
      if (!Validpassword) res.status(400).json('Wrong password  please try again !!')

      else {
        const token = jwt.sign({ id: user._id, email: req.body.email }, process.env.SECRET_KEY, { expiresIn: '30d' })
        res.status(200).cookie("token", token, { httpOnly: true }).json({ user, token: token });
        // res.status(200).json(user);
      }
    }
    else
      res.status(404).json("User not found please register");


  } catch (err) {
    console.log(err);
  }
}

const updateUser = async (req, res) => {
  const ac_token = req.cookies.token;

  if (ac_token != null && ac_token != undefined) {
    const data = jwt.verify(ac_token, process.env.SECRET_KEY);
    const userId = data.id;
    console.log(userId, req.body.userId);
    if (req.body.userId === userId || req.body.isAdmin) {
      // console.log("here\n");
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);

        } catch (err) {
          // console.log('here2\n');
          return res.status(500).json(err);
        }

        try {
          const person = await User.findByIdAndUpdate(req.body.userId, {
            $set: req.body,
          });
          // console.log("here3\n");
          res.status(200).json(person);
        } catch (err) {
          console.log(err);
          return res.status(500).json(err);
        }
      }
    }
    else
      res.status(403).json('You can only update your own account!!')
  }
  else {
    res.status(404).json('Unauthorized access');
  }
}
const deleteUser = async (req, res) => {
  const ac_token = req.cookies.token;

  if (ac_token != null && ac_token != undefined) {
    const data = jwt.verify(ac_token, process.env.SECRET_KEY);
    const userId = data.id;
    if (req.body.userId == userId || req.body.isAdmin) {
      try {

        try {
          const person = await User.findById(req.body.userId);
          if (person != null || person != undefined) {
            const user = await User.findByIdAndDelete(req.body.userId);

            res.clearCookie('token').status(200).json('User Successfully removed from the database');
          }
          else
            res.status(404).json('User not Found');

        } catch (err) {
          res.status(404).send('User not found');
        }



      } catch (err) {
        console.log(err);
        res.status(500).json('User not found');
      }

    }
    else {
      res.status(400).json('You can delete your account only');
    }
  }
  else {
    res.status(500).json('Unauthorized Access');
  }
}

const searchUser = async (req, res) => {
  const ac_token = req.cookies.token;

  if (ac_token != null && ac_token != undefined) {
    const data = jwt.verify(ac_token, process.env.SECRET_KEY);
    const userId = data.id;
    try {
      const person = await User.findById(req.body.userId);
      const { password, updatedAt, ...other } = person._doc;
      if (person != null || person != undefined)
        res.status(200).json(other);
      else
        res.status(404).json('User not Found');

    } catch (err) {
      res.status(404).send('User not found');
    }
  }
  else {
    res.status(404).json('You are not logged in please login to search other users!!');
  }

}

const followUsers = async (req, res) => {
  const acc_token = req.cookies.token;
  if (acc_token != null && acc_token != undefined) {
    const data = jwt.verify(acc_token, process.env.SECRET_KEY);
    const userId = data.id;
    if (data != null && data != undefined) {
      if (userId !== req.body.userId) {
        try {
          const currentuser = await User.findById(userId);
          if (currentuser !== null && currentuser !== undefined) {
            try {
              const user = await User.findById(req.body.userId);
              if (user != null && user != undefined) {
                if (!user.followers.includes(userId)) {
                  await user.updateOne({ $push: { followers: userId } });
                  await currentuser.updateOne({ $push: { following: req.body.userId } });
                  res.status(200).json(user);
                }
                else {
                  res.status(403).json('User already followed');
                }
              }
            }
            catch (err) {
              console.log(err);
              res.status(500).json(err);
            }
          }
          else {
            console.log(err);
            res.status(404).json('Please Register with us');
          }

        }
        catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      }
      else {

        return res.status(404).json('You cannot follow yourself!!');
      }
    }
    else {
      res.status(203).json('Unauthorized access!!');
    }



  }
  else {
    res.status(404).json('Login or Register with us to follow other users!');
  }
}


const unfollowUsers = async (req, res) => {
  const acc_token = req.cookies.token;
  if (acc_token != null && acc_token != undefined) {
    const data = jwt.verify(acc_token, process.env.SECRET_KEY);
    const userId = data.id;
    // console.log(userId,req.body.);
    if (data != null && data != undefined) {
      if (userId !== req.body.userId) {
        try {

          const currentuser = await User.findById(userId);
          if (currentuser !== null &&  currentuser !== undefined) {

            try{
                const user=await User.findById(req.body.userId)
                if(user!=null && user!=undefined)
                {
                  if (currentuser.following.includes(req.body.userId)) {
                    await currentuser.updateOne({ $pull: { following: req.body.userId } });
                    await user.updateOne({ $pull: { followers: userId } });
                    res.status(200).json('unfollowed successfully');
                  }
                  else {
                    res.status(403).json('You are not following him ');
                  }
                }
                else
                {
                  console.log(err);
                  res.status(404).json('User not found!!');
                }

            }
            catch (err) {
              console.log(err);
              res.status(500).json(err);
            }

          }
          else
          {
            res.status(404).json('You are not registered with Us!');
          }

        }
        catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      }
      else {
        res.status(403).json('You cannot unfollow yourself');
      }
    }
    else {
      res.status(404).json('You are signed out !!PLease sign in or register');
    }
  }
  else {
    res.status(404).json('Unauthorized access');
  }
}
module.exports = { register, login, updateUser, deleteUser, searchUser, followUsers, unfollowUsers };