import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Provide a username']
    },
    email: {
        type: String,
        required: [true, 'Provide a email'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Provide a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Provide a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String, 
    resetPasswordExpireDt: Date, 
    isLoggedIn: {
        type: Boolean, 
        default: false,
    },
    isEmailVerified: {
        type: Boolean, 
        default: false,
    },
    verification: {
        otp: {
            type: String,
            default: '',
        },
        expiryTimeStamp: {
            type: Number, 
            default: 0,
        }
    }
});

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

UserSchema.methods.comparePasswords = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

const UserModel = mongoose.model('user', UserSchema);
export default UserModel;