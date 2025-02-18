import User from '../model/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import Token from '../model/token.js'


dotenv.config();



// export const  signupUser =async (request,response) =>{
//     try {

// const hashedPassword = await bcrypt.hash(request.body.password,10)

//         const user ={username:request.body.username,name:request.body.name,password:hashedPassword};
//         const newUser  = new User(user);
//         await newUser.save();
//         return response.status(200).json({msg:"signup successful"})
//     } catch (error) {
//         console.error('Error while signing up the user:', error);
//         return response.status(500).json({msg:"Error while signup the user"})
//     }
    
// }

export const signupUser = async (request, response) => {
    try {
        // 1. Validate required fields
        const { username, name, password } = request.body;
        
        if (!username || !name || !password) {
            return response.status(400).json({ 
                msg: "All fields (username, name, password) are required" 
            });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create user
        const newUser = new User({
            username,
            name,
            password: hashedPassword
        });

        // 4. Save user
        await newUser.save();

        // 5. Return appropriate response
        return response.status(201).json({ 
            msg: "Signup successful",
            user: {
                id: newUser._id,
                username: newUser.username,
                name: newUser.name
            }
        });

    } catch (error) {
        // 6. Handle specific error types
        console.error('Error while signing up:', error);

        if (error.name === 'ValidationError') {
            return response.status(400).json({
                msg: "Validation failed",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        if (error.code === 11000) { // Duplicate key error
            return response.status(409).json({
                msg: "Username already exists"
            });
        }

        return response.status(500).json({ 
            msg: "Internal server error during signup" 
        });
    }
};



export const loginUser =async (request,response)=>{
    let user = await User.findOne({username:request.body.username});
    if(!user){
        return response.status(400).json({msg:"Username does not match"});
    }
    try {
        let match = await bcrypt.compare(request.body.password ,user.password);
        if(match){
       const accessToken = jwt.sign(user.toJSON(),process.env.ACCESS_SECRET_KEY,{expiresIn:'15m'})
       const refreshToken =jwt.sign(user.toJSON(),process.env.REFRESH_SECRET_KEY);

    const newToken=new Token({token:refreshToken})
    await newToken.save();

    return response.status(200).json({
        accessToken,
        refreshToken,
        name: user.name,
        username: user.username,
        _id: user._id
    });
        }
        else{

            return response.status(400).json({msg:'password does not match'})
        }
    } catch (error) {
        console.error('Error while logging in the user:', error);
        return response.status(500).json({msg:'Error while login the user'})
    }

}

export const followUser = async (request, response) => {
    try {
        const userToFollow = await User.findById(request.params.id);
        const currentUser = await User.findById(request.body.userId);

        if (!userToFollow || !currentUser) {
            return response.status(404).json({ msg: 'User not found' });
        }

        if (!userToFollow.followers.includes(request.body.userId)) {
            await userToFollow.updateOne({ $push: { followers: request.body.userId }});
            await currentUser.updateOne({ $push: { following: request.params.id }});
            return response.status(200).json('User followed successfully');
        } else {
            return response.status(400).json('You already follow this user');
        }
    } catch (error) {
        return response.status(500).json(error);
    }
}

export const unfollowUser = async (request, response) => {
    try {
        const userToUnfollow = await User.findById(request.params.id);
        const currentUser = await User.findById(request.body.userId);

        if (!userToUnfollow || !currentUser) {
            return response.status(404).json({ msg: 'User not found' });
        }

        if (userToUnfollow.followers.includes(request.body.userId)) {
            await userToUnfollow.updateOne({ $pull: { followers: request.body.userId }});
            await currentUser.updateOne({ $pull: { following: request.params.id }});
            return response.status(200).json('User unfollowed successfully');
        } else {
            return response.status(400).json('You do not follow this user');
        }
    } catch (error) {
        return response.status(500).json(error);
    }
}