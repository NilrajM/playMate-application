import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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

export const findUserByEmail = async(email) => {
    return await User.findOne({email});
}

export const generateResetToken = (userId) => {
    const resetToken = jwt.sign({userId: userId}, process.env.RESET_TOKEN_SECRET, {expiresIn: '15m'});
    return resetToken;
}

export const updateResetToken = async(userId, resetToken, resetExpireDate) => {
    await User.findByIdAndUpdate(userId, {
        resetPasswordToken: resetToken,
        resetPasswordExpireDt: resetExpireDate
    });
}

export const sendResetPasswordLink = async(email, resetToken) => {
    try{
        const resetLink = `http://localhost:3001/resetpassword/${resetToken}`;
        const mail = {
            from: 'nilrajmayekar@gmail.com',
            to: email,
            subject: 'Reset password request',
            html: `<p>You have requested to reset your password. Please click on the following link: </p>
                    <a href="${resetLink}" target="_blank">${resetLink}</a>`,
        };

        await transporter.sendMail(mail);
        return true;
    }
    catch(err){
        throw new Error(err.message);
    }
}

export const forgotPassword = async(email) => {
    try{
        const user = await findUserByEmail(email);

        if(!user){
            return {success: false};
        }

        const resetToken = generateResetToken(user._id);
        const resetExpireDate = new Date();
        resetExpireDate.setMinutes(resetExpireDate.getMinutes() + 15);

        await updateResetToken(user._id, resetToken, resetExpireDate);

        await sendResetPasswordLink(email, resetToken);
        
        return {success: true};
    }
    catch(err){
        throw new Error(err.message);
    }
}

export const verifyResetToken = (resetToken) => {
    try{
        const decoded = jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET);
        return decoded.userId;
    }
    catch(err){
        throw new Error('Invalid reset token');
    }
}

export const updatePassword = async(userId, newPassword) => {
    const salt = await bcrypt.genSalt(12);
    const hashedPass = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(userId, {
        password: hashedPass,
        resetPasswordToken: null, 
        resetPasswordExpireDt: null,
    });
}

export const getNewAccessToken = (refreshToken) => {
    try{
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const accessToken = jwt.sign({userId: decoded.userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});

        return accessToken;
    }
    catch(err){
        throw new Error('Invalid refresh token');
    }
}

