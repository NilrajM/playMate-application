import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import transporter from '../../emailConfig.js';
import { totp } from 'otplib';

const otpSecretKey = `${process.env.OTP_SECRET_KEY}`;
totp.options = {digits: 6, step: 300, crypto: {createHmac: (alg, key) => crypto.createHmac(alg, key)}};


export const saveUser = async(newUser) => {
    try{
        const user = new User(newUser);

        const otp = totp.generate(otpSecretKey);
        const expiryTimeStamp = Date.now() + 3 * 60 * 1000;

        user.verification = {
            otp, 
            expiryTimeStamp,
        }
        await user.save();
        return user;
    }
    catch(err){
        throw new Error(err.message);
    }
}

export const getUserById = async(userId) => {
    try{
        const user = await User.findById(userId);
        if(!user){
            throw new Error('User not found');
        }
        return user;
    }
    catch(err){
        throw new Error('Error fetching user by Id from the database')
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

// const otpGenerator = generateOtp('1234567890', 6);

export const generateOtpWithTimeStamp = () => {
    const otp = totp.generate(otpSecretKey);
    const timeStamp = Date.now();
    const expirationTime = 3 * 60 * 1000;
    const expiryTimeStamp = timeStamp + expirationTime;

    return {otp, expiryTimeStamp};
}

export const sendVerificationEmail = async(email, otp) => {
    const mailOptions = {
        from: 'nilrajmayekar@gmail.com',
        to: email,
        subject: 'Email verification otp',
        text: `Your OTP for email verification is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
}

export const verifyEmail = async(email, otp) => {
    const user = await User.findOne({email});

    if(!user){
        throw new Error('User not found');
    }

    const otpDetails = await getStoredOtpDetails(user._id);
    if(!isOtpValid(otp, otpDetails)){
        throw new Error('Invalid or expired OTP');
    }

    user.isEmailVerified = true;
    await user.save();
    return user;
}

const isOtpValid = (enteredOtp, otpDetails) => {
    return (
        enteredOtp === otpDetails.otp && Date.now() <= otpDetails.expiryTimeStamp
    );
};

const getStoredOtpDetails = async(userId) => {
    try{
        const user = await User.findById(userId);

        if(!user){
            throw new Error('User not found');
        }

        const otpDetails = {
            otp: user.verification.otp,
            expiryTimeStamp: user.verification.expiryTimeStamp,
        };

        return otpDetails;
    }
    catch(err){
        throw new Error('Error fetching OTP details from the database');
    }
}

