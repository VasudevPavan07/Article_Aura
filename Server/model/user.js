import mongoose from "mongoose";


const  userSchema =mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username :{
type:String,
required:true,
unique:true
    },
    password:{
       type:String,
       required:true
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'  // Note: using lowercase 'user' to match your model name
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
})

 const user=mongoose.model('user',userSchema);
 export default user;