import * as userAuthService from '../services/userAuth-service.js';

export const registerUser = async(req, res) => {
    try{
        const newUser = {...req.body};
        const user = await userAuthService.saveUser(newUser);
        res.status(201).json({
            success: true,
            user,
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
            })
        }

        await userAuthService.flagUserLoggedIn(user._id);

        const tokens = userAuthService.generateTokens(user._id);

        res.header('Authorization', `Bearer ${tokens.accessToken}`);

        res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true});

        res.status(200).json({
            success: true,
            tokens,
            user
        });
    }
    catch(err){
        res.status(500).json({
            success: true,
            message: err.message,
        })
    }
}