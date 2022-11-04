const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

//UPDATE
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      let currentUser = await User.findById(req.params.id);

      const newUser = {
        username: req.body.username ? req.body.username : currentUser.username,
        email: req.body.email ? req.body.email : currentUser.email,
      };
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: newUser,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can update only your account!");
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json("User not found!");
    }
  } else {
    res.status(401).json("You can delete only your account!");
  }
});

//GET USER
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//favourites

router.get("/:id/favourites", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { favourites, ...others } = user._doc;
    // console.log(favourites);
    // console.log(user);
    const posts = await Post.find({ _id: { $in: favourites } });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/:id/myposts", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { username, ...others } = user._doc;
    // console.log(favourites);
    // console.log(user);
    // console.log(username);
    const posts = await Post.find({ username: username });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;