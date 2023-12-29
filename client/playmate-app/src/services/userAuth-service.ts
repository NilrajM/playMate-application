import * as baseService from './base-service';

const registerPath = '/auth/signUp';
const loginPath = '/auth/signIn';
const forgotPasswordPath = '/auth/forgotPassword';
const resetPasswordPath = '/auth/resetPassword';

export const registerUSer = async(userData: any): Promise<any> => {
    const user = await baseService.post<any>(registerPath, userData);
    return user;
}

export const loginUser = async (credentials: any): Promise<any> => {
    const user = await baseService.post<any>(loginPath, credentials);
    return user;
}

export const forgotPassword = async(email: string): Promise<any> => {
    const result = await baseService.post<any>(forgotPasswordPath, {email});
    return result;
}

export const resetPassword = async (resetData: any): Promise<any> => {
    const result = await baseService.post<any>(resetPasswordPath, resetData);
    return result;
}