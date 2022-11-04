const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const userSchema =mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    profilePic:{
        type:String,
        default:""
    },
    favourites:[{
        type:ObjectId,
        ref:"Post"
    }],
    likedPosts :[{
        type:ObjectId,
        ref:"Post"
    }]
    

},
{timestamps:true}
);

module.exports = mongoose.model("User",userSchema);

