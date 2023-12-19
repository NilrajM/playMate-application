import User from '../models/user.js';
import jwt from 'jsonwebtoken';

export const saveUser = async(newUser) => {
    try{
        const user = new User(newUser);
        await user.save();
        return user;
    }
    catch(err){
        throw new Error(err.message);
    }
}

export const userLogin = async(email, password) => {
    const user = await User.findOne({email}).select('+password');

    if(!user){
        throw new Error("Invalid email or password");
    }

    const isPasswordMatch = await user.comparePasswords(password);

    if(!isPasswordMatch){
        throw new Error('Invalid password');
    }

    return user;
}

export const generateTokens = (userId) => {
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET);

    return {accessToken, refreshToken};
}

export const flagUserLoggedIn = async(userId) => {
    await User.findByIdAndUpdate(userId, {isLoggedIn: true});
}

export const flagUserLoggedOut = async(userId) => {
    await User.findByIdAndUpdate(userId, {isLoggedIn: false});
}