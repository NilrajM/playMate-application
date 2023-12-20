import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nilrajmayekar@gmail.com',
        pass: 'zudm zjfw mazd wtok',
    }
});

export default transporter;