import * as userAuthService from '../services/userAuth-service.js';

export const registerUser = async(req, res) => {
    try{
        const newUser = {...req.body};
        const user = await userAuthService.saveUser(newUser);

        const otpWithTimeStamp = userAuthService.generateOtpWithTimeStamp();
        console.log(otpWithTimeStamp);
        await userAuthService.sendVerificationEmail(
            user.email,
            otpWithTimeStamp.otp
        )
        res.status(201).json({
            success: true,
            user,
            message: 'User registered. Check your email for verification',
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const login = async(req, res) => {
    try{
        const {email, password} = req.body;
        const user = await userAuthService.userLogin(email, password);

        if(!user){
            res.status(401).json({
                success: false,
                message: 'Invalide email or password',
            });
            return;
        }

        await userAuthService.flagUserLoggedIn(user._id);

        const updatedUser = await userAuthService.getUserById(user._id);

        const tokens = userAuthService.generateTokens(updatedUser._id);

        res.header('Authorization', `Bearer ${tokens.accessToken}`);

        res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true});

        res.status(200).json({
            success: true,
            tokens,
            user: updatedUser
        });
    }
    catch(err){
        res.status(500).json({
            success: true,
            message: err.message,
        })
    }
}

export const verifyEmail = async (req, res) => {
    try{
        const {email, otp} = req.body;
        const user = await userAuthService.verifyEmail(email, otp);

        res.status(200).json({
            success: true, 
            message: 'Email verified successfully',
            user,
        })
    }
    catch(err){
        res.status(400).json({
            success: false,
            message: err.message,
        })
    }
}

export const logout = async(req, res) => {
    try{
        const userId = req.user._id;

        await userAuthService.flagUserLoggedOut(userId);

        res.clearCookie('refreshToken');

        res.status(200).json({
            success: true,
            message: 'User is logged out successfully'
        });
    }
    catch(err){
        res.status(500).json({
            success: false, 
            message: err.message,
        })
    }
}