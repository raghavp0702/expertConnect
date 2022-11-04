const router = require('express').Router();

const User = require('../models/User');
const bcrypt = require('bcrypt');

//REGISTER
router.post('/register', async(req, res) => {

    try {
        
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        });

        const user = await newUser.save();
        res.status(200).json(user);

    } 
    catch (err) {
        res.status(500).json(err);
        
    }

})
//LOGIN

router.post('/login',async(req,res)=>{

    try {
        const user = await User.findOne({username:req.body.username});

        if(!user)
        {
            return res.status(404).json('Wrong Credentials');
        }
        
        const validate = await bcrypt.compare(req.body.password,user.password);


        //sending everything except password
        if(!validate)
        {
            return res.status(404).json('Wrong Credentials');
        }
        const {password, ...others} = user._doc;
        
        res.status(200).json(others);


    } catch (err) {
        res.status(500).json(err);
    }


})


module.exports = router;
