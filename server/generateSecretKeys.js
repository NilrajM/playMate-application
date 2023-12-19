import crypto from 'crypto';

function generateRandomeSecret(len){
    return crypto.randomBytes(Math.ceil(len/2)).toString('hex').slice(0,len);
}

const accessTokenSecret = generateRandomeSecret(64);
const refreshTokenSecret = generateRandomeSecret(64);

console.log("Access Token Secret: ", accessTokenSecret);
console.log("Refresh Token Secret: ", refreshTokenSecret);